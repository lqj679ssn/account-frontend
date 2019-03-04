export class LoadCallback {
  loaded: boolean;
  callback: any;

  constructor() {
    this.callback = null;
    this.loaded = false;
  }

  load() {
    this.loaded = true;
    if (this.callback) {
      this.callback();
    }
  }
}
