import * as path from "path";
import * as fs from "fs";
import { configManager } from "../extension";

export const loadAvailableModules = async (): Promise<string[]> => {
  const addonsPaths = configManager.settings.server.find(
    (s) => s.file === "addons_path"
  )?.value;

  if (!addonsPaths) {
    return [];
  }
  const paths = addonsPaths as string;
  const pathArr = paths.split(",").map((p) => p.trim());
  const moduleSet = new Set<string>();

  for (const addonsPath of pathArr) {
    try {
      const files = await fs.promises.readdir(addonsPath);
      for (const file of files) {
        const fullPath = path.join(addonsPath, file);
        const stat = await fs.promises.stat(fullPath);
        if (stat.isDirectory() && file[0] !== "." && file !== "__pycache__") {
          moduleSet.add(file);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${addonsPath}:`, error);
    }
  }

  return Array.from(moduleSet).sort();
};
