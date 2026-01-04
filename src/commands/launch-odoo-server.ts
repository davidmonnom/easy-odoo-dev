import * as vscode from "vscode";
import {
  getOdooBinaryPath,
  getPythonVenvPath,
  isServerRunning,
} from "../utils";
import { configManager } from "../extension";

export let odooTaskExecution: vscode.TaskExecution | undefined;

export async function launchOdooServer() {
  const isRunning = await isServerRunning();
  if (isRunning) {
    vscode.window.showWarningMessage(
      "Odoo server is already running. Please stop it before starting."
    );
    return;
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
}

export async function stopOdooServer() {
  if (odooTaskExecution) {
    odooTaskExecution.terminate();
    odooTaskExecution = undefined;
    vscode.window.showInformationMessage("Odoo server has been stopped.");
  }
}
