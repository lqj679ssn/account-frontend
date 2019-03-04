export class MenuFootBtn {
  icon: string;
  text: string;
  hide: boolean;

  constructor(d: {icon, text, hide}) {
    this.icon = d.icon;
    this.text = d.text;
    this.hide = d.hide;
  }
}
