import * as vscode from "vscode";
import { getOdooConfigPath } from "../utils";

export function openConfigFile() {
  const configPath = getOdooConfigPath();
  const uri = vscode.Uri.file(configPath);
  vscode.window.showTextDocument(uri);
}
