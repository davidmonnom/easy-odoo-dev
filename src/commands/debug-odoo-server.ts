import * as vscode from "vscode";
import * as path from "path";
import {
  getOdooBinaryPath,
  getPythonVenvPath,
  isServerRunning,
} from "../utils";
import { configManager } from "../extension";

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
  const isRunning = await isServerRunning();
  if (isRunning) {
    vscode.window.showWarningMessage(
      "Odoo server is already running. Please stop it before starting a debugging session."
    );
    return;
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
}

export async function stopOdooDebugSession() {
  if (!odooDebugSessionId) {
    return false;
  }

  const active = vscode.debug.activeDebugSession;
  if (active && active.id === odooDebugSessionId) {
    await vscode.commands.executeCommand("workbench.action.debug.stop");
    return true;
  }

  // Fallback: stop whatever debug session is active
  await vscode.commands.executeCommand("workbench.action.debug.stop");
  return true;
}
