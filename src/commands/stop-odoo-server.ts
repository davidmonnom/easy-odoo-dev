import { configManager } from "../extension";
import { isServerRunning, runShellCommand } from "../utils";
import { stopOdooDebugSession } from "./debug-odoo-server";
import { stopOdooServer } from "./launch-odoo-server";

export async function stopServer(): Promise<void> {
  await stopOdooServer();
  await stopOdooDebugSession();

  const stillRunning = await isServerRunning();
  if (stillRunning) {
    await tryToKillByPort();
  }
}

async function tryToKillByPort(): Promise<void> {
  const httpConfig = configManager.settings.http;
  const serverPort = httpConfig.find(
    (setting) => setting.file === "http_port"
  )?.value;

  // Will only works if the process is owned by the current user
  runShellCommand(`kill -9 $(lsof -t -i :${serverPort || 8069})`);
}
