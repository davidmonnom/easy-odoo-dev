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

    registerCallback("load-settings", (data) => {
      this.state.settings = data;
    });

    registerCallback("server-state", (data) => {
      this.state.serverState = data;
    });

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
