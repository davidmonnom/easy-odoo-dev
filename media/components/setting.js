class Setting extends Component {
  static components = { Input };
  static props = {
    section: String,
    setting: Object,
    callback: Function,
  };

  setup() {
    this.inputRef = useRef("input");
    this.checkboxRef = useRef("checkbox");

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
          <Input setting="this.props.setting" callback="this.props.callback" />
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
