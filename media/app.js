const { Component, mount, xml, useEffect, useState, useRef } = owl;
const vscode = acquireVsCodeApi();

/**
 * Little hooks because t-on-change isn't allowed in VSC extensions.
 */
function useInputListener(event, el, callback) {
  useEffect(
    () => {
      if (!el?.el) {
        return;
      }

      const element = el.el;
      element.addEventListener(event, callback);
      return () => element.removeEventListener(event, callback);
    },
    () => [el]
  );
}

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

class Setting extends Component {
  static props = {
    section: String,
    setting: Object,
    callback: Function,
  };

  setup() {
    this.inputRef = useRef("input");
    this.checkboxRef = useRef("checkbox");

    useInputListener("blur", this.inputRef, (event) => {
      this.props.callback(this.props.setting.file, event.target.value);
    });

    useInputListener("change", this.checkboxRef, (event) => {
      this.props.callback(
        this.props.setting.file,
        Boolean(event.target.checked)
      );
    });
  }

  get isFilled() {
    if (this.props.setting.type === "boolean") {
      return this.props.setting.value;
    }

    return this.props.setting.value && this.props.setting.value.length > 0;
  }

  static template = xml`
    <div class="setting-container">
      <div class="content" t-att-class="{'content-filled': this.isFilled}">
        <div class="title">
          <span class="category"><span t-esc="this.props.sectionName" />: </span>
          <span class="name" t-esc="this.props.setting.title" />
        </div>
        <t t-if="!this.props.setting.isBoolean">
          <p class="description" t-esc="this.props.setting.description" />
          <div class="setting-input-container">
            <div class="setting-option"><span t-esc="this.props.setting.cli" /></div>
            <input t-ref="input" t-att-value="this.props.setting.value" />
          </div>
        </t>
        <t t-else="">
          <input t-att-id="this.props.setting.file" type="checkbox" t-att-checked="this.props.setting.value" t-ref="checkbox" />
          <div class="checkbox-container">
          <label class="fake-checkbox-box" t-att-for="this.props.setting.file">
            <svg
              t-if="this.props.setting.value"
              part="checked-indicator"
              class="checked-indicator"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
              />
            </svg>
          </label>
          <span class="description" t-esc="this.props.setting.description" />
          </div>
        </t>
      </div>
    </div>
  `;
}

class App extends Component {
  static components = { Setting, Actions };

  setup() {
    const foldedSectionsStorage = localStorage.getItem(
      "easy-odoo-dev.folded-sections"
    );

    this.searchInput = useRef("searchInput");
    this.state = useState({
      settings: {},
      searchString: "",
      serverState: "stopped", // stopped, running, debugging
      foldedSections: foldedSectionsStorage
        ? new Set(JSON.parse(foldedSectionsStorage))
        : new Set(),
    });

    useInputListener("input", this.searchInput, (event) => {
      this.state.searchString = event.target.value;
    });

    useEffect(
      () => {
        const handleMessage = (event) => {
          const message = event.data;

          switch (message.type) {
            case "load-settings":
              this.state.settings = message.data;
              break;
            case "server-state":
              console.log("Server state updated:", message.data);
              this.state.serverState = message.data;
              break;
          }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
      },
      () => []
    );

    useEffect(
      () => {
        if (Object.keys(this.state.settings).length !== 0) {
          return;
        }
        this.loadSettings();
      },
      () => [this.state.settings]
    );
  }

  loadSettings() {
    vscode.postMessage({ type: "load-settings" });
  }

  onSettingUpdate(key, value) {
    vscode.postMessage({ type: "save-settings", key, value });
  }

  getSettingSectionName(setting) {
    const names = {
      testing: "Testing Options",
      server: "Server Options",
      http: "HTTP Options",
      database: "Database Options",
      emails: "Emails Options",
      internationalisation: "L10n Options",
      logging: "Logging Options",
      multiprocessing: "Multiprocessing Options",
      developer: "Developer Options",
    };

    return names[setting] || "None";
  }

  onClickFoldSection(sectionKey) {
    const foldedSections = this.state.foldedSections;
    if (foldedSections.has(sectionKey)) {
      this.state.foldedSections.delete(sectionKey);
    } else {
      this.state.foldedSections.add(sectionKey);
    }

    localStorage.setItem(
      "easy-odoo-dev.folded-sections",
      JSON.stringify(Array.from(this.state.foldedSections))
    );
  }

  matchSearch(setting) {
    if (!this.state.searchString || this.state.searchString.length === 0) {
      return true;
    }

    const searchString = this.state.searchString.toLowerCase();
    return (
      setting.title.toLowerCase().includes(searchString) ||
      setting.cli.toLowerCase().includes(searchString) ||
      setting.file.toLowerCase().includes(searchString)
    );
  }

  shouldShowSection(settings) {
    if (!this.state.searchString || this.state.searchString.length === 0) {
      return true;
    }

    for (const setting of settings) {
      if (this.matchSearch(setting)) {
        return true;
      }
    }
    return false;
  }

  static template = xml`
    <div class="w-100 h-100 overflow-hidden">
      <div class="sticky-header">
        <Actions serverState="state.serverState" />
        <input t-ref="searchInput" placeholder="Search settings..." />
      </div>
      <div>
        <t t-foreach="Object.entries(this.state.settings)" t-as="entry" t-key="entry_index">
          <t t-set="key" t-value="entry[0]" />
          <t t-set="sectionName" t-value="getSettingSectionName(key)" />
          <t t-set="settings" t-value="entry[1]" />
          <div class="setting-section" t-if="shouldShowSection(settings)">
            <div class="title-container">
              <p class="title" t-esc="sectionName" />
              <p class="subtitle">
                <span t-esc="settings.length" /> available settings.
              </p>
            </div>
            <t t-set="isFolded" t-value="this.state.foldedSections.has(key)" />
            <span class="fold-action" t-on-click="() => this.onClickFoldSection(key)">
              <span t-if="isFolded">Unfold</span>
              <span t-else="">Fold</span>
            </span>
          </div>
          <div class="setting-list" t-att-class="{'d-none': isFolded}">
            <t t-foreach="settings" t-as="setting" t-key="setting_index">
              <Setting t-if="matchSearch(setting)"
                setting="setting"
                callback.bind="onSettingUpdate"
                sectionName="sectionName" />
            </t>
          </div>
        </t>
      </div>
    </div>
  `;
}

mount(App, document.body);
