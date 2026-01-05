class Actions extends Component {
  static props = {
    serverState: String,
  };

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

  static template = xml`
    <div>
      <div class="actions-container">
        <button class="start-btn"
          t-on-click="launchOdooServer"
          t-att-class="{'disabled': this.props.serverState !== 'stopped'}">
          Start
        </button>
        <button class="start-btn"
          t-on-click="debugOdooServer"
          t-att-class="{'disabled': this.props.serverState !== 'stopped'}">
          Debug
        </button>
        <button class="stop-btn"
          t-on-click="stopOdooServer"
          t-att-class="{'disabled': this.props.serverState === 'stopped'}">
          Stop
        </button>
      </div>
      <div class="actions-container">
        <button class="config-btn" t-on-click="openConfigFile">
          Open Config File
        </button>
        <button class="config-btn" t-on-click="dropCurrentDatabase">
          Drop Current Database
        </button>
      </div>
    </div>
  `;
}
