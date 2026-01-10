import * as vscode from "vscode";
import { configManager } from "../extension";
import { isServerRunning, runShellCommand } from "../utils";
import { stopOdooDebugSession } from "./debug-odoo-server";
import { stopOdooServer } from "./launch-odoo-server";

export async function stopServer(): Promise<void> {
  let status = await stopOdooServer();
  status = status || (await stopOdooDebugSession());

  const stillRunning = await isServerRunning();
  if (stillRunning) {
    status = status || (await tryToKillByPort());
  }

  if (!status) {
    vscode.window.showWarningMessage(
      "Nothing has been done. The Odoo server is probably not running or cannot be stopped automatically."
    );
  }
}

async function tryToKillByPort(): Promise<boolean> {
  const httpConfig = configManager.settings.http;
  const serverPort = httpConfig.find(
    (setting) => setting.file === "http_port"
  )?.value;

  // Will only works if the process is owned by the current user
  try {
    await runShellCommand(`kill -9 $(lsof -t -i :${serverPort || 8069})`);
    return true;
  } catch {
    return false;
  }
}
