import * as vscode from "vscode";
import { WebviewProvider } from "./views/webview";
import { debugOdooServer } from "./commands/debug-odoo-server";
import { launchOdooServer } from "./commands/launch-odoo-server";
import { ConfigManager } from "./config";
import { openConfigFile } from "./commands/open-config-file";
import { stopServer } from "./commands/stop-odoo-server";
import { dropCurrentDatabase } from "./commands/drop-current-database";

export const configManager = new ConfigManager();
export function activate(context: vscode.ExtensionContext) {
  // Watchers
  const configPath = configManager.getConfigPath();
  const watcher = vscode.workspace.createFileSystemWatcher(configPath);

  // Register Webview Provider
  const provider = new WebviewProvider(context, watcher);
  const type = WebviewProvider.viewType;
  const sub = vscode.window.registerWebviewViewProvider(type, provider);

  // Register commands
  const launchServerCommand = vscode.commands.registerCommand(
    "easy-odoo-dev.launch-server",
    launchOdooServer
  );
  const debugServerCommand = vscode.commands.registerCommand(
    "easy-odoo-dev.debug-server",
    () => debugOdooServer()
  );
  const stopServerCommand = vscode.commands.registerCommand(
    "easy-odoo-dev.stop-server",
    async () => stopServer()
  );
  const openConfigFileCommand = vscode.commands.registerCommand(
    "easy-odoo-dev.open-config-file",
    () => openConfigFile()
  );
  const dropCurrentDatabaseCommand = vscode.commands.registerCommand(
    "easy-odoo-dev.drop-current-database",
    async () => dropCurrentDatabase()
  );

  // Add to context subscriptions
  context.subscriptions.push(sub);
  context.subscriptions.push(watcher);
  context.subscriptions.push(launchServerCommand);
  context.subscriptions.push(debugServerCommand);
  context.subscriptions.push(stopServerCommand);
  context.subscriptions.push(openConfigFileCommand);
  context.subscriptions.push(dropCurrentDatabaseCommand);
}
