import * as vscode from "vscode";
import * as path from "path";
import {
  getOdooBinaryPath,
  getPythonVenvPath,
  isServerRunning,
} from "../utils";
import { configManager, statusBarItems } from "../extension";
import { stopServer } from "./stop-odoo-server";

export let odooDebugSessionId: string | undefined;
vscode.debug.onDidStartDebugSession((s) => {
  if (s.name === "Debug Odoo Server") {
    odooDebugSessionId = s.id;
  }
});

vscode.debug.onDidTerminateDebugSession((session) => {
  if (session.id === odooDebugSessionId) {
    odooDebugSessionId = undefined;
  }
});

export async function debugOdooServer() {
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
    "Starting Odoo server in debug mode. Make sure to set breakpoints as needed."
  );

  const odooBin = getOdooBinaryPath();
  const venv = getPythonVenvPath();
  const args = configManager.getSettingArgStrings();
  const pythonPath = path.join(venv, "bin", "python");
  const wsFolder = vscode.workspace.workspaceFolders?.[0]; // can be undefined
  const ok = await vscode.debug.startDebugging(wsFolder, {
    name: "Debug Odoo Server",
    type: "debugpy",
    request: "launch",
    program: odooBin,
    args,
    console: "integratedTerminal",
    cwd: wsFolder?.uri.fsPath,
    justMyCode: false,
    python: pythonPath,
    pythonPath: pythonPath as any,
  } as any);

  if (!ok) {
    vscode.window.showErrorMessage("Failed to start Python debugging session.");
  }
  // Update status bar items
  if (statusBarItems.debug) {
    statusBarItems.debug.text = `$(bug) EOD: Restart Debug`;
  }

  if (statusBarItems.stop) {
    statusBarItems.stop.show();
    statusBarItems.stop.text = `$(stop) EOD: Stop Debug`;
  }
}

export async function stopOdooDebugSession() {
  if (statusBarItems.debug) {
    statusBarItems.debug.text = `$(bug) EOD: Debug Server`;
  }

  if (statusBarItems.stop) {
    statusBarItems.stop.hide();
  }

  if (!odooDebugSessionId) {
    return false;
  }

  await vscode.commands.executeCommand("workbench.action.debug.stop");
  odooDebugSessionId = undefined;
  return true;
}
