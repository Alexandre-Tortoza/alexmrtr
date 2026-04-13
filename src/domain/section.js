export class Section {
  constructor({ label, value, icon = "", url = null }) {
    this.label = label;
    this.value = value;
    this.icon  = icon;
    this.url   = url;
  }
}
