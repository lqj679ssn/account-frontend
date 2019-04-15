export class LoadCallback {
  loaded: boolean;
  callbacks: Set<any>;

  constructor() {
    this.loaded = false;
    this.callbacks = new Set();
  }

  load() {
    this.loaded = true;
    const callbackList = Array.from(this.callbacks);
    for (const c of callbackList) {
      c();
      this.callbacks.delete(c);
    }
  }

  calling(callback) {
    this.callbacks.add(callback);
  }
}
