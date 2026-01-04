import * as vscode from "vscode";
import { configManager } from "../extension";
import { dropDatabase } from "../utils";
import { stopServer } from "./stop-odoo-server";

export async function dropCurrentDatabase(): Promise<boolean> {
  await stopServer();
  const currentDbName = configManager.settings.server.find(
    (setting) => setting.file === "db_name"
  )?.value;

  if (!currentDbName) {
    return false;
  }

  const result = await dropDatabase(currentDbName as string);
  if (!result) {
    vscode.window.showErrorMessage(`Failed to drop database: ${currentDbName}`);
  } else {
    vscode.window.showInformationMessage(`Database dropped: ${currentDbName}`);
  }

  return result;
}
