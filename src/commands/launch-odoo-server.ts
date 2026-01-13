import * as vscode from "vscode";
import {
  getOdooBinaryPath,
  getPythonVenvPath,
  isServerRunning,
} from "../utils";
import { configManager, statusBarItems } from "../extension";
import { stopServer } from "./stop-odoo-server";

export let odooTaskExecution: vscode.TaskExecution | undefined;

export async function launchOdooServer() {
  if (await isServerRunning()) {
    await stopServer();
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (await isServerRunning()) {
      vscode.window.showWarningMessage(
        "Impossible to start Odoo server because other instance cannot be stopped."
      );
      return;
    }
  }

  vscode.window.showInformationMessage(
    "Starting Odoo server. You can monitor the output in the terminal."
  );

  const binary = getOdooBinaryPath();
  const venv = getPythonVenvPath();
  const settings = configManager.getSettingArgStrings().join(" ");
  const command = `
    source "${venv}/bin/activate" &&
    ${binary} ${settings}
  `;

  const task = new vscode.Task(
    { type: "odoo", task: "start-server" },
    vscode.TaskScope.Global,
    "Start Odoo Server",
    "easy-odoo-dev",
    new vscode.ShellExecution(command)
  );

  task.presentationOptions = {
    reveal: vscode.TaskRevealKind.Always,
    panel: vscode.TaskPanelKind.Dedicated,
    clear: false,
    focus: false,
  };

  odooTaskExecution = await vscode.tasks.executeTask(task);
  if (statusBarItems.start) {
    statusBarItems.start.text = `$(server) EOD: Restart Server`;
  }

  if (statusBarItems.stop) {
    statusBarItems.stop.show();
    statusBarItems.stop.text = `$(stop) EOD: Stop Server`;
  }
}

export async function stopOdooServer() {
  if (statusBarItems.start) {
    statusBarItems.start.text = `$(server) EOD: Start Server`;
  }

  if (statusBarItems.stop) {
    statusBarItems.stop.hide();
  }

  if (odooTaskExecution) {
    odooTaskExecution.terminate();
    odooTaskExecution = undefined;
    vscode.window.showInformationMessage("Odoo server has been stopped.");
    return true;
  }
}
