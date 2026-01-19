const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

console.info(
  `%c UPCOMING-CLASSES-CARD %c v1.0.1 `,
  "color: white; background: #555; font-weight: bold;",
  "color: white; background: #716F6F; font-weight: bold;"
);

class UpcomingClassesCard extends LitElement {
  static properties = {
    hass: {},
    config: {},
    _classes: { state: true },
    _editingIndex: { state: true },
    _isEditing: { state: true },
    _selectedDate: { state: true },
    _currentMonth: { state: true },
    _currentYear: { state: true },
    _isAM: { state: true },
    _showDatePicker: { state: true },
  };

  static styles = css`
    @import url('https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;700&display=swap');

    :host {
      font-family: 'Karla', sans-serif;
      --card-bg: var(--ha-card-background, #4a4a4a);
      --class-bg: var(--secondary-background-color, #e8e8e8);
      --text-color: var(--primary-text-color, #212121);
      --text-color-secondary: var(--secondary-text-color, #727272);
      --border-color: var(--divider-color, #e0e0e0);
      --input-border: rgba(0, 0, 0, 0.12);
    }

    .wrapper {
      min-width: 330px;
      padding: 25px;
      position: relative;
      background: var(--card-bg);
      border-radius: 16px;
      outline: 1px var(--border-color) solid;
      outline-offset: -1px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 26px;
    }

    .add-button {
      right: -5px;
      top: -5px;
      position: absolute;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
    }

    .add-button svg {
      width: 20px;
      height: 20px;
    }

    .class-list {
      display: flex;
      flex-direction: column;
      gap: 26px;
      width: 100%;
    }

    .class-list.hidden {
      display: none;
    }

    .class-item {
      align-self: stretch;
      padding: 13px 16px 13px 26px;
      background: var(--class-bg);
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      outline: 1px var(--input-border) solid;
      outline-offset: -1px;
      display: flex;
      flex-direction: column;
      gap: 13px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .class-item:hover {
      transform: translateY(-2px);
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    }

    .class-name {
      color: var(--text-color);
      font-size: 20px;
      font-weight: 500;
    }

    .class-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
    }

    .class-assignment {
      flex: 1;
      color: var(--text-color);
      font-size: 14px;
      font-weight: 500;
    }

    .class-due {
      color: var(--text-color);
      font-size: 15px;
      font-weight: 500;
    }

    /* Edit View */
    .edit-view {
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      width: 100%;
    }

    .edit-view.active {
      display: flex;
    }

    .form-card {
      width: 100%;
      padding: 16px 26px;
      background: var(--class-bg);
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      outline: 1px var(--input-border) solid;
      outline-offset: -1px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form-input {
      width: 100%;
      padding: 5px 0;
      background: transparent;
      border: none;
      font-size: 14px;
      font-family: 'Karla', sans-serif;
      font-weight: 300;
      color: var(--text-color);
      outline: none;
    }

    .form-input.title-input {
      padding: 0;
      font-size: 20px;
      font-weight: 500;
    }

    .form-input::placeholder {
      color: #6C757D;
    }

    .trash-btn {
      cursor: pointer;
      padding: 4px;
      background: none;
      border: none;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .trash-btn:hover {
      opacity: 1;
    }

    /* Date Picker */
    .datetime-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .datetime-trigger {
      width: 100%;
      padding: 3px 12px;
      background: var(--class-bg);
      border-radius: 6px;
      outline: 1px var(--border-color) solid;
      outline-offset: -1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: outline-color 0.2s;
    }

    .datetime-trigger:hover {
      outline-color: var(--text-color);
    }

    .datetime-placeholder {
      color: #6C757D;
      font-size: 16px;
      font-weight: 200;
      line-height: 24px;
    }

    .datetime-placeholder.has-value {
      color: var(--text-color);
    }

    .datetime-dropdown {
      display: none;
      background: #E8E8E8;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      flex-direction: column;
      gap: 10px;
    }

    .datetime-dropdown.active {
      display: flex;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 4px;
    }

    .calendar-nav {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 8px;
      color: var(--text-color);
      font-size: 18px;
      font-weight: 500;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .calendar-nav:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .calendar-month-year {
      color: var(--text-color);
      font-size: 16px;
      font-weight: 500;
    }

    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      text-align: center;
    }

    .calendar-weekday {
      color: #6C757D;
      font-size: 12px;
      font-weight: 500;
      padding: 4px;
    }

    .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 28px);
      gap: 4px;
      justify-content: space-between;
    }

    .calendar-day {
      width: 28px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: var(--text-color);
      cursor: pointer;
      border-radius: 50%;
      transition: background 0.2s;
      background: none;
      border: none;
    }

    .calendar-day:hover:not(.empty):not(.selected) {
      background: rgba(0, 0, 0, 0.1);
    }

    .calendar-day.empty {
      cursor: default;
    }

    .calendar-day.today {
      outline: 1px solid var(--text-color);
      outline-offset: -1px;
    }

    .calendar-day.selected {
      background: var(--text-color);
      color: white;
    }

    .calendar-day.past {
      color: var(--border-color);
    }

    .time-picker {
      display: flex;
      gap: 20px;
      align-items: center;
      justify-content: center;
    }

    .time-input-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .time-input {
      width: 36px;
      padding: 4px;
      text-align: center;
      background: var(--class-bg);
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-family: 'Karla', sans-serif;
      font-weight: 500;
      color: var(--text-color);
      outline: 1px solid var(--border-color);
    }

    .time-input:focus {
      outline-color: var(--text-color);
    }

    .time-separator {
      font-size: 20px;
      font-weight: 500;
      color: var(--text-color);
    }

    .time-ampm {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ampm-btn {
      padding: 2px 6px;
      background: var(--class-bg);
      border: none;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      color: #6C757D;
      cursor: pointer;
      transition: all 0.2s;
    }

    .ampm-btn.active {
      background: var(--text-color);
      color: white;
    }

    .save-btn {
      padding: 12px 34px;
      background: var(--class-bg);
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      outline: 1px var(--input-border) solid;
      outline-offset: -1px;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      font-size: 20px;
      font-family: 'Karla', sans-serif;
      font-weight: 400;
      transition: all 0.2s;
    }

    .save-btn:hover {
      background: #CFCFCF;
    }

    .error-message {
      color: #d32f2f;
      padding: 20px;
      border-radius: 4px;
      background: #ffebee;
    }
  `;

  constructor() {
    super();
    this._classes = [];
    this._editingIndex = null;
    this._isEditing = false;
    this._selectedDate = null;
    this._currentMonth = new Date().getMonth();
    this._currentYear = new Date().getFullYear();
    this._isAM = true;
    this._showDatePicker = false;
    this._timeHour = '12';
    this._timeMinute = '00';
  }

  setConfig(config) {
    this.config = {
      title: 'Upcoming Classes',
      storage_key: 'upcoming_classes',
      ...config
    };
    this._loadClasses();
  }

  _loadClasses() {
    const stored = localStorage.getItem(this.config.storage_key);
    if (stored) {
      this._classes = JSON.parse(stored);
    } else {
      this._classes = [];
    }
  }

  _saveClasses() {
    localStorage.setItem(this.config.storage_key, JSON.stringify(this._classes));
  }

  _getTimeRemaining(dueDate) {
    if (!dueDate) return '--';
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;

    if (diff <= 0) return 'Past due';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} Day${days > 1 ? 's' : ''}`;
    return `${hours} Hour${hours !== 1 ? 's' : ''}`;
  }

  _showEditView(index = null) {
    this._editingIndex = index;
    this._isEditing = true;
    this._showDatePicker = false;

    if (index === null) {
      this._selectedDate = null;
      this._timeHour = '12';
      this._timeMinute = '00';
      this._isAM = true;
    } else {
      const cls = this._classes[index];
      if (cls.dueDate) {
        this._selectedDate = new Date(cls.dueDate);
        this._currentMonth = this._selectedDate.getMonth();
        this._currentYear = this._selectedDate.getFullYear();

        let hours = this._selectedDate.getHours();
        this._isAM = hours < 12;
        if (hours === 0) hours = 12;
        else if (hours > 12) hours -= 12;

        this._timeHour = hours.toString().padStart(2, '0');
        this._timeMinute = this._selectedDate.getMinutes().toString().padStart(2, '0');
      } else {
        this._selectedDate = null;
        this._timeHour = '12';
        this._timeMinute = '00';
        this._isAM = true;
      }
    }
  }

  _hideEditView() {
    this._isEditing = false;
    this._editingIndex = null;
    this._showDatePicker = false;
  }

  _getDatetimeDisplay() {
    if (!this._selectedDate) return 'Select date';

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = this._selectedDate.getDate();
    const month = months[this._selectedDate.getMonth()];
    const year = this._selectedDate.getFullYear();
    const period = this._isAM ? 'AM' : 'PM';

    return `${month} ${date}, ${year} at ${this._timeHour}:${this._timeMinute} ${period}`;
  }

  _getSelectedDateTime() {
    if (!this._selectedDate) return null;

    let hours = parseInt(this._timeHour) || 12;
    const minutes = parseInt(this._timeMinute) || 0;

    if (!this._isAM && hours !== 12) hours += 12;
    if (this._isAM && hours === 12) hours = 0;

    const dt = new Date(this._selectedDate);
    dt.setHours(hours, minutes, 0, 0);
    return dt.toISOString();
  }

  _handleSave() {
    const nameInput = this.shadowRoot.querySelector('#classNameInput');
    const assignmentInput = this.shadowRoot.querySelector('#assignmentInput');

    const name = nameInput?.value?.trim();
    const assignment = assignmentInput?.value?.trim();

    if (!name) {
      nameInput?.focus();
      return;
    }

    const classData = {
      name,
      assignment: assignment || 'No assignment',
      dueDate: this._getSelectedDateTime()
    };

    if (this._editingIndex !== null) {
      this._classes[this._editingIndex] = classData;
    } else {
      this._classes.push(classData);
    }

    this._saveClasses();
    this._hideEditView();
    this.requestUpdate();
  }

  _handleDelete() {
    if (this._editingIndex !== null) {
      this._classes.splice(this._editingIndex, 1);
      this._saveClasses();
      this._hideEditView();
      this.requestUpdate();
    }
  }

  _prevMonth() {
    this._currentMonth--;
    if (this._currentMonth < 0) {
      this._currentMonth = 11;
      this._currentYear--;
    }
  }

  _nextMonth() {
    this._currentMonth++;
    if (this._currentMonth > 11) {
      this._currentMonth = 0;
      this._currentYear++;
    }
  }

  _selectDate(day) {
    this._selectedDate = new Date(this._currentYear, this._currentMonth, day);
  }

  _renderCalendar() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const firstDay = new Date(this._currentYear, this._currentMonth, 1).getDay();
    const daysInMonth = new Date(this._currentYear, this._currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(html`<div class="calendar-day empty"></div>`);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(this._currentYear, this._currentMonth, day);
      thisDate.setHours(0, 0, 0, 0);

      const isPast = thisDate < today;
      const isToday = thisDate.getTime() === today.getTime();
      const isSelected = this._selectedDate &&
        this._selectedDate.getDate() === day &&
        this._selectedDate.getMonth() === this._currentMonth &&
        this._selectedDate.getFullYear() === this._currentYear;

      days.push(html`
        <button
          class="calendar-day ${isPast ? 'past' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}"
          @click=${() => this._selectDate(day)}
        >${day}</button>
      `);
    }

    return html`
      <div class="calendar-header">
        <button class="calendar-nav" @click=${this._prevMonth}>&lt;</button>
        <span class="calendar-month-year">${months[this._currentMonth]} ${this._currentYear}</span>
        <button class="calendar-nav" @click=${this._nextMonth}>&gt;</button>
      </div>
      <div class="calendar-weekdays">
        ${weekdays.map(d => html`<span class="calendar-weekday">${d}</span>`)}
      </div>
      <div class="calendar-days">${days}</div>
    `;
  }

  render() {
    const editingClass = this._editingIndex !== null ? this._classes[this._editingIndex] : null;

    return html`
      <div class="wrapper">
        <button class="add-button" @click=${() => this._showEditView(null)}>
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#D9D9D9"/>
            <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#C1C1C1"/>
            <path d="M9.75849 6.563H10.2485V9.79H13.3145V10.21H10.2485V13.437H9.75849V10.21H6.68549V9.79H9.75849V6.563Z" fill="#535252"/>
          </svg>
        </button>

        <div class="class-list ${this._isEditing ? 'hidden' : ''}">
          ${this._classes.map((cls, index) => html`
            <div class="class-item" @click=${() => this._showEditView(index)}>
              <div class="class-name">${cls.name}</div>
              <div class="class-meta">
                <div class="class-assignment">${cls.assignment}</div>
                <div class="class-due">${this._getTimeRemaining(cls.dueDate)}</div>
              </div>
            </div>
          `)}
          ${this._classes.length === 0 ? html`<div class="class-item"><div class="class-name">No classes</div></div>` : ''}
        </div>

        <div class="edit-view ${this._isEditing ? 'active' : ''}">
          <div class="form-card">
            <div class="form-header">
              <input
                type="text"
                class="form-input title-input"
                id="classNameInput"
                placeholder="Class Name"
                .value=${editingClass?.name || ''}
              >
              <button
                class="trash-btn"
                @click=${this._handleDelete}
                style="display: ${this._editingIndex !== null ? 'block' : 'none'}"
              >
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.263153 2.57143H1.31578M1.31578 2.57143H9.73684M1.31578 2.57143V10.5714C1.31578 10.8745 1.42669 11.1652 1.62409 11.3795C1.8215 11.5939 2.08924 11.7143 2.36842 11.7143H7.63157C7.91075 11.7143 8.17849 11.5939 8.3759 11.3795C8.5733 11.1652 8.68421 10.8745 8.68421 10.5714V2.57143M2.89473 2.57143V1.42857C2.89473 1.12547 3.00563 0.834776 3.20304 0.620448C3.40045 0.406121 3.66819 0.285713 3.94736 0.285713H6.05263C6.3318 0.285713 6.59954 0.406121 6.79695 0.620448C6.99436 0.834776 7.10526 1.12547 7.10526 1.42857V2.57143" stroke="#393939" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <input
              type="text"
              class="form-input"
              id="assignmentInput"
              placeholder="Assignment"
              .value=${editingClass?.assignment || ''}
            >

            <div class="datetime-container">
              <div class="datetime-trigger" @click=${() => this._showDatePicker = !this._showDatePicker}>
                <span class="datetime-placeholder ${this._selectedDate ? 'has-value' : ''}">${this._getDatetimeDisplay()}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.9372 -0.000823975C11.1788 -0.000811046 11.3747 0.195059 11.3747 0.436676V0.874176H12.2497C13.2162 0.874189 13.9997 1.65769 13.9997 2.62418V12.2492C13.9997 13.2157 13.2162 13.9992 12.2497 13.9992H1.74966C0.783166 13.9992 -0.000335625 13.2157 -0.000335693 12.2492V2.62418C-0.000335693 1.65768 0.783166 0.874176 1.74966 0.874176H2.62466V0.436676C2.62466 0.195051 2.82054 -0.000823975 3.06216 -0.000823975C3.30378 -0.000811046 3.49966 0.195059 3.49966 0.436676V0.874176H10.4997V0.436676C10.4997 0.195051 10.6955 -0.000823975 10.9372 -0.000823975ZM0.874664 12.2492C0.874664 12.7324 1.26642 13.1242 1.74966 13.1242H12.2497C12.7329 13.1242 13.1247 12.7324 13.1247 12.2492V3.49918H0.874664V12.2492Z" fill="#6C757D"/>
                </svg>
              </div>

              <div class="datetime-dropdown ${this._showDatePicker ? 'active' : ''}">
                ${this._renderCalendar()}

                <div class="time-picker">
                  <div class="time-input-group">
                    <input
                      type="text"
                      class="time-input"
                      maxlength="2"
                      .value=${this._timeHour}
                      @input=${(e) => {
                        let val = parseInt(e.target.value) || 0;
                        if (val > 12) val = 12;
                        if (val < 1 && e.target.value !== '') val = 1;
                        this._timeHour = val ? val.toString().padStart(2, '0') : '';
                      }}
                    >
                    <span class="time-separator">:</span>
                    <input
                      type="text"
                      class="time-input"
                      maxlength="2"
                      .value=${this._timeMinute}
                      @input=${(e) => {
                        let val = parseInt(e.target.value) || 0;
                        if (val > 59) val = 59;
                        this._timeMinute = val.toString().padStart(2, '0');
                      }}
                    >
                  </div>
                  <div class="time-ampm">
                    <button class="ampm-btn ${this._isAM ? 'active' : ''}" @click=${() => this._isAM = true}>AM</button>
                    <button class="ampm-btn ${!this._isAM ? 'active' : ''}" @click=${() => this._isAM = false}>PM</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button class="save-btn" @click=${this._handleSave}>Save</button>
        </div>
      </div>
    `;
  }

  getCardSize() {
    return 4;
  }

  static getStubConfig() {
    return {
      storage_key: 'upcoming_classes'
    };
  }
}

if (!customElements.get("upcoming-classes-card")) {
  customElements.define("upcoming-classes-card", UpcomingClassesCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "upcoming-classes-card",
  name: "Upcoming Classes Card",
  description: "A card to display and manage upcoming classes with due dates",
  preview: true,
});
