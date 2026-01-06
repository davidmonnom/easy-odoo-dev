import * as vscode from "vscode";
import * as net from "net";
import * as child_process from "child_process";
import * as os from "os";
import { configManager } from "./extension";

export function getLocalIPAddress(): string | undefined {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return undefined;
}

export const getNonce = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const isServerRunning = async () => {
  const { port, host } = configManager.getPortAndHost();
  const isOpen = await isPortOpen(port, host);
  return isOpen;
};

export const isPortOpen = (port: number, host: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.once("timeout", () => resolve(false));

    socket.connect(port, host);
  });
};

export const dropDatabase = async (name: string): Promise<boolean> => {
  try {
    await runShellCommand(`dropdb ${name}`);
    return true;
  } catch {
    return false;
  }
};

export const runShellCommand = (command: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    child_process.exec(command, {}, (err, stdout, stderr) =>
      !err ? resolve(stdout.toString()) : reject(stderr.toString())
    );
  });
};

export const getOdooBinaryPath = () => {
  const config = vscode.workspace.getConfiguration("easy-odoo-dev");
  const binaryPath = config.get<string>("odoo-bin") || "";
  return binaryPath;
};

export const getPythonVenvPath = () => {
  const config = vscode.workspace.getConfiguration("easy-odoo-dev");
  const venvPath = config.get<string>("python-venv") || "";
  return venvPath;
};

export const getOdooConfigPath = () => {
  const config = vscode.workspace.getConfiguration("easy-odoo-dev");
  const configPath = config.get<string>("config-file") || "";
  return configPath;
};
