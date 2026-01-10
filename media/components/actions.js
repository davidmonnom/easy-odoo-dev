class ActionButton extends Component {
  static props = {
    iconUri: String,
    tooltip: String,
    onClick: Function,
    disabled: Boolean,
  };

  setup() {
    super.setup();
  }

  static template = xml`
    <div class="tooltip-container">
      <button t-att-class="{'disabled': this.props.disabled}" t-on-click="this.props.onClick">
        <img t-att-src="this.props.iconUri" class="btn-icon" height="14" width="14"/>
      </button>
      <div class="tooltip-text" t-esc="this.props.tooltip"/>
    </div>
  `;
}

class Actions extends Component {
  static components = { ActionButton };
  static props = {
    serverState: String,
  };

  setup() {
    super.setup();
    this.startIconUri = globalThis.icons.startIconUri;
    this.debugIconUri = globalThis.icons.debugIconUri;
    this.stopIconUri = globalThis.icons.stopIconUri;
    this.databaseIconUri = globalThis.icons.databaseIconUri;
    this.configIconUri = globalThis.icons.configIconUri;
    this.browserIconUri = globalThis.icons.browserIconUri;
  }

  launchOdooServer() {
    vscode.postMessage({ type: "launch-odoo-server" });
  }

  debugOdooServer() {
    vscode.postMessage({ type: "debug-odoo-server" });
  }

  stopOdooServer() {
    vscode.postMessage({ type: "stop-odoo-server" });
  }

  openConfigFile() {
    vscode.postMessage({ type: "open-config-file" });
  }

  dropCurrentDatabase() {
    vscode.postMessage({ type: "drop-current-database" });
  }

  openInBrowser() {
    vscode.postMessage({ type: "open-in-browser" });
  }

  get startServerLabel() {
    const state = this.props.serverState;
    return state === "running" && state !== "debugging" ? "Restart" : "Start";
  }

  get serverDebugLabel() {
    const state = this.props.serverState;
    return state === "debugging" && state !== "running"
      ? "Restart Debug"
      : "Debug";
  }

  static template = xml`
    <div class="actions-container">
      <ActionButton
        iconUri="this.startIconUri"
        onClick="this.launchOdooServer"
        tooltip="this.startServerLabel"
        disabled="this.props.serverState === 'debugging'"/>
      <ActionButton
        iconUri="this.debugIconUri"
        onClick="this.debugOdooServer"
        tooltip="this.serverDebugLabel"
        disabled="this.props.serverState === 'running'"/>
      <ActionButton
        iconUri="this.stopIconUri"
        onClick="this.stopOdooServer"
        tooltip="'Stop Server'"
        disabled="this.props.serverState === 'stopped'"/>
      <ActionButton
        iconUri="this.browserIconUri"
        onClick="this.openInBrowser"
        tooltip="'Open in Browser'"
        disabled="this.props.serverState === 'stopped'"/>
      <ActionButton
        iconUri="this.databaseIconUri"
        tooltip="'Drop Current Database'"
        onClick="this.dropCurrentDatabase"/>
      <ActionButton
        iconUri="this.configIconUri"
        tooltip="'Open Config File'"
        onClick="this.openConfigFile"/>
    </div>
  `;
}
