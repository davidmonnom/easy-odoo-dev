import * as vscode from "vscode";
import { getNonce, isServerRunning } from "../utils";
import { odooDebugSessionId } from "../commands/debug-odoo-server";
import { odooTaskExecution } from "../commands/launch-odoo-server";
import { configManager } from "../extension";
import { loadDatabases } from "../functions/load-databases";
import { loadAvailableModules } from "../functions/load-available-modules";

export class WebviewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private readonly _extensionUri: vscode.Uri;
  public static readonly viewType = "easy-odoo-dev-view";

  constructor(
    private readonly context: vscode.ExtensionContext,
    watcher: vscode.FileSystemWatcher
  ) {
    this._extensionUri = context.extensionUri;
    this.context = context;

    watcher.onDidChange(() => {
      configManager.initializeConfig();
      this.sendSettingValues();
    });
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = this.getWebviewOptions();
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    webviewView.webview.onDidReceiveMessage(this.handleMessage.bind(this));
    this._view = webviewView;
    this.stateWatcher();

    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("easy-odoo-dev.config-file")) {
        configManager.initializeConfig();
        this.sendSettingValues();
      }
    });
  }

  /**
   * Periodically send the server state to the webview
   * so that the UI can update accordingly.
   *
   * This is only active when the webview is opened.
   */
  private stateWatcher = () => {
    setInterval(async () => {
      let state = odooDebugSessionId
        ? "debugging"
        : odooTaskExecution
        ? "running"
        : "stopped";

      if (state === "stopped" && (await isServerRunning())) {
        state = "running";
      }

      if (this._view) {
        this._view.webview.postMessage({
          type: "server-state",
          data: state,
        });
      }
    }, 500);
  };

  private sendSettingValues() {
    if (this._view) {
      this._view.webview.postMessage({
        type: "load-settings",
        data: configManager.settings,
      });
    }
  }

  private async sendDatabaseList() {
    const database = await loadDatabases();
    if (this._view) {
      this._view.webview.postMessage({
        type: "load-databases",
        data: database,
      });
    }
  }

  private async loadAvailableModules() {
    const modules = await loadAvailableModules();
    if (this._view) {
      this._view.webview.postMessage({
        type: "load-available-modules",
        data: modules,
      });
    }
  }

  private launchOdooServer() {
    vscode.commands.executeCommand("easy-odoo-dev.launch-server");
  }

  private debugOdooServer() {
    vscode.commands.executeCommand("easy-odoo-dev.debug-server");
  }

  private stopOdooServer() {
    vscode.commands.executeCommand("easy-odoo-dev.stop-server");
  }

  private openConfigFile() {
    vscode.commands.executeCommand("easy-odoo-dev.open-config-file");
  }

  private dropCurrentDatabase() {
    vscode.commands.executeCommand("easy-odoo-dev.drop-current-database");
  }

  private async handleMessage(data: any) {
    switch (data.type) {
      case "save-settings": {
        configManager.updateSettingValue(data.key, data.value);
        this.sendSettingValues();
        break;
      }
      case "load-settings": {
        this.sendSettingValues();
        break;
      }
      case "open-config-file": {
        this.openConfigFile();
        break;
      }
      case "launch-odoo-server": {
        this.launchOdooServer();
        break;
      }
      case "debug-odoo-server": {
        this.debugOdooServer();
        break;
      }
      case "stop-odoo-server": {
        this.stopOdooServer();
        break;
      }
      case "drop-current-database": {
        this.dropCurrentDatabase();
        break;
      }
      case "load-databases": {
        this.sendDatabaseList();
        break;
      }
      case "load-available-modules": {
        this.loadAvailableModules();
        break;
      }
    }
  }

  private getWebviewOptions(): vscode.WebviewOptions {
    return {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const nonce = getNonce();

    // Css
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleAppUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "app.css")
    );

    // Javascript
    const owlUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "lib", "owl.js")
    );
    const appUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "app.js")
    );
    const globalsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "globals.js")
    );
    const inputUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "components", "input.js")
    );
    const settingUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "media",
        "components",
        "setting.js"
      )
    );
    const actionsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "media",
        "components",
        "actions.js"
      )
    );

    return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<!-- Unsafe eval is needed for owl.js -->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}' 'unsafe-eval';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleAppUri}" rel="stylesheet">
				<title>Easy Odoo Dev</title>
			</head>
			<body>
				<script nonce="${nonce}" src="${owlUri}"></script>
        <script nonce="${nonce}" src="${globalsUri}"></script>
        <script nonce="${nonce}" src="${inputUri}"></script>
        <script nonce="${nonce}" src="${settingUri}"></script>
        <script nonce="${nonce}" src="${actionsUri}"></script>
				<script nonce="${nonce}" src="${appUri}"></script>
			</body>
		</html>`;
  }
}
