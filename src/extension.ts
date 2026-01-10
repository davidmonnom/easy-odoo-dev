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

  // Status bar item
  const statusBarItemStart = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItemStart.command = "easy-odoo-dev.launch-server";
  statusBarItemStart.text = `$(server) EOD: Start Server`;
  statusBarItemStart.tooltip = "Launch Odoo Server";
  statusBarItemStart.show();

  const statusBarItemDebug = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItemDebug.command = "easy-odoo-dev.debug-server";
  statusBarItemDebug.text = `$(bug) EOD: Debug Server`;
  statusBarItemDebug.tooltip = "Debug Odoo Server";
  statusBarItemDebug.show();

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = "easy-odoo-dev.stop-server";
  statusBarItem.text = `$(stop) EOD: Stop Server`;
  statusBarItem.tooltip = "Stop Odoo Server";
  statusBarItem.show();

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
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(statusBarItemStart);
  context.subscriptions.push(statusBarItemDebug);
}
