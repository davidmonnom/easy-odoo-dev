class Input extends Component {
  static props = {
    messageKey: { type: String, optional: true },
    setting: Object,
    callback: Function,
  };

  setup() {
    this.inputRef = useRef("input");
    this.suggestionsRef = useRef("suggestions");
    this.state = useState({
      focused: false,
      searchInput: this.props.setting.value,
      options: [],
    });

    useInputListener("input", this.inputRef, (event) => {
      this.state.searchInput = event.target.value;
    });

    useInputListener("blur", this.inputRef, () => {
      this.state.focused = false;
      this.props.callback(this.props.setting.file, this.state.searchInput);
    });

    useInputListener("focus", this.inputRef, () => {
      this.state.focused = true;
      if (this.props.setting.messageKey) {
        vscode.postMessage({ type: this.props.setting.messageKey });
      }
    });

    if (this.props.setting.messageKey) {
      registerCallback(this.props.setting.messageKey, (data) => {
        this.state.options = data;
      });
    }

    useEffect(
      () => {
        if (!this.props.setting.messageKey || !this.suggestionsRef?.el) {
          return;
        }

        /**
         * Handle option selection from the suggestions list.
         */
        const ref = this.suggestionsRef.el;
        const setOptions = (e) => {
          const option = e.target.id;
          if (option) {
            this.handleOptionClick(option);
          }
        };

        ref.addEventListener("mousedown", (e) => setOptions(e));

        /**
         * Handle selection with arrow keys and enter.
         */
        const inputEl = this.inputRef.el;
        const handleKeyDown = (e) => {
          const options = this.getOptions();
          if (!options.length) {
            return;
          }

          const focusedOption = ref.querySelector(".option.focused");
          let index = -1;
          if (focusedOption) {
            index = options.indexOf(focusedOption.id);
          }

          const handleKeyAction = (index) => {
            const options = ref.querySelectorAll(".option");
            options.forEach((el) => el.classList.remove("focused"));
            const optionEl = options[index];
            optionEl.classList.add("focused");
            optionEl.scrollIntoView({ block: "nearest" });
          };

          if (e.key === "ArrowDown") {
            e.preventDefault();
            if (index < options.length - 1) {
              index += 1;
            } else {
              index = 0;
            }

            handleKeyAction(index);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (index > 0) {
              index -= 1;
            } else {
              index = options.length - 1;
            }

            handleKeyAction(index);
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (index >= 0) {
              const option = options[index];
              this.handleOptionClick(option);
            }
          }
        };

        inputEl.addEventListener("keydown", handleKeyDown);
        return () => {
          ref.removeEventListener("mousedown", (e) => setOptions(e));
          inputEl.removeEventListener("keydown", handleKeyDown);
        };
      },
      () => [this.state.options, this.suggestionsRef]
    );
  }

  handleOptionClick(option) {
    const currentValue = this.state.searchInput;
    if (currentValue.includes(",")) {
      const parts = currentValue.split(",");
      parts[parts.length - 1] = option;
      this.state.searchInput = parts.join(",");
    } else {
      this.state.searchInput = option;
    }
    this.props.callback(this.props.setting.file, this.state.searchInput);
  }

  getOptions() {
    let input = this.state.searchInput.toLowerCase();

    if (input.includes(",")) {
      const parts = input.split(",");
      input = parts[parts.length - 1].trim();
    }

    return this.state.options.filter((option) =>
      option.toLowerCase().includes(input)
    );
  }

  static template = xml`
    <div class="position-relative">
      <div class="setting-input-container">
        <div class="setting-option"><span t-esc="this.props.setting.cli" /></div>
        <input t-ref="input" t-att-value="this.state.searchInput" />
      </div>
      <div t-ref="suggestions" class="setting-input-suggestions position-absolute" t-if="this.state.options.length and this.state.focused">
        <div t-foreach="this.getOptions()"
          t-as="option"
          t-key="option_index"
          t-att-id="option"
          class="option">
          <span t-esc="option" />
        </div>
      </div>
    </div>
  `;
}
