export class Radio {
  public active: boolean;
  constructor() {
    this.active = false;
  }

  get class() {
    return this.active ? 'active' : 'inactive';
  }

  get editIcon() {
    return this.active ? 'icon-ok' : 'icon-edit';
  }
}

export class RadioList {
  public list: Array<Radio>;

  constructor(l: Array<Radio>) {
    this.list = l;
  }

  toggle(r: Radio) {
    if (r.active) {
      r.active = false;
      return;
    }
    for (const radio of this.list) {
      radio.active = radio === r;
    }
  }

  activate(r: Radio) {
    if (r.active) {
      return;
    }
    for (const radio of this.list) {
      radio.active = radio === r;
    }
  }

  deactivate(r: Radio) {
    r.active = false;
  }
}
