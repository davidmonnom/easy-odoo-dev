import * as vscode from "vscode";
import * as fs from "fs";
import { parse, stringify } from "ini";
import { settings } from "./settings";

type ConfigOptions = {
  [key: string]: string | boolean | number;
};

type SettingDefinition = {
  [section: string]: {
    title: string;
    cli: string;
    file: string;
    description: string;
    isBoolean: boolean;
    value: string | boolean | number;
  }[];
};

export class ConfigManager {
  public settings: SettingDefinition = {
    server: [],
    testing: [],
    http: [],
  };

  constructor() {
    this.settings = settings;
    this.initializeConfig();
  }

  public getSettingArgStrings(): string[] {
    const args: string[] = [];
    for (const settingList of Object.values(this.settings)) {
      for (const setting of settingList) {
        if (setting.value === "") {
          continue;
        }

        if (setting.isBoolean) {
          if (setting.value === true) {
            args.push(`${setting.cli}`);
          }
        } else {
          args.push(`${setting.cli}=${setting.value}`);
        }
      }
    }

    return args;
  }

  public getConfigPath(): string {
    const config = vscode.workspace.getConfiguration("easy-odoo-dev");
    const path = config.get<string>("config-file") || "";
    return path;
  }

  public updateSettingValue(
    file: string,
    value: string | boolean | number
  ): boolean {
    for (const settingList of Object.values(this.settings)) {
      for (const setting of settingList) {
        if (setting.file === file) {
          setting.value = value;
          this.updateConfigFile();
          return true;
        }
      }
    }

    return false;
  }

  public getPortAndHost() {
    const portSetting = this.settings.http.find((s) => s.file === "http_port");
    const interfaceSetting = this.settings.http.find(
      (s) => s.file === "http_interface"
    );
    const port = Number(portSetting?.value) || 8069;
    const host = String(interfaceSetting?.value) || "0.0.0.0";

    return { port, host };
  }

  public initializeConfig() {
    if (!this.configFileExists()) {
      return;
    }

    const options = this.readConfigFile();
    if (!options) {
      return;
    }

    for (const settingList of Object.values(this.settings)) {
      for (const setting of settingList) {
        if (setting.file in options) {
          setting.value = options[setting.file];
        }
      }
    }
  }

  private updateConfigFile() {
    if (!this.configFileExists()) {
      return;
    }

    const options: ConfigOptions = {};
    for (const settingList of Object.values(this.settings)) {
      for (const setting of settingList) {
        if (setting.value === "") {
          continue;
        }

        if (setting.isBoolean && setting.value === false) {
          continue;
        }

        options[setting.file] = setting.value;
      }
    }

    const iniContent = stringify({ options });
    fs.writeFileSync(this.getConfigPath(), iniContent, "utf-8");
  }

  private readConfigFile(): ConfigOptions | false {
    if (!this.configFileExists()) {
      return false;
    }

    const readed = fs.readFileSync(this.getConfigPath(), "utf-8");
    const config = parse(readed);
    return config.options;
  }

  private configFileExists(): boolean {
    const path = this.getConfigPath();
    const exists = path && fs.existsSync(path) ? true : false;

    if (!exists) {
      vscode.window.showWarningMessage(
        `Odoo configuration file not found at path: ${path}. Please set a valid path in the extension settings.`
      );
    }

    return exists;
  }
}
