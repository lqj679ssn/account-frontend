export class ChooseItem {
  key: string;
  value: string;
  id: string;
  selected: boolean;
  constructor(_: {key, value, id, selected}) {
    this.key = _.key;
    this.value = _.value;
    this.id = _.id || _.key;
    this.selected = _.selected;
  }
}
