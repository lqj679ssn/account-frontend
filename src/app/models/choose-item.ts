export class ChooseItem {
  key: string;
  value: string;
  id: string;
  selected: boolean;
  always: boolean;
  desc: string;
  external: any;

  static fromScope(scope) {
    return new ChooseItem({
      key: scope.desc,
      value: '',
      id: '' + scope.name,
      always: scope.always,
      desc: scope.detail,
    });
  }

  static fromPremise(premise) {
    return new ChooseItem({
      key: premise.desc,
      value: '',
      id: '' + premise.name,
      desc: premise.detail,
      external: {check: premise.check},
    });
  }

  constructor(_: {key, value, id, selected?, always?, desc?, descRight?, external?}) {
    this.key = _.key;
    this.value = _.value;
    this.id = _.id || _.key;
    this.desc = _.desc;
    this.always = [true, false].includes(_.always) ? _.always : null;
    this.selected = this.always ? true : this.always === false ? false : _.selected || false;
    this.external = _.external;
  }

  get icon() {
    return this.selected ? 'icon-checked' : 'icon-unchecked';
  }

  get keyDesc() {
    if (this.desc) {
      return `${this.key}（${this.desc}）`;
    } else {
      return this.key;
    }
  }
}
