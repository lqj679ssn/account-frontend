import {Injectable} from '@angular/core';

@Injectable()
export class LocalService {
  private local: Storage;
  constructor() {
    this.local = window.localStorage;
  }

  load(key: string) {
    return this.local.getItem(key);
  }

  save(key: string, value: string) {
    return this.local.setItem(key, value);
  }

  remove(key: string) {
    return this.local.removeItem(key);
  }
}
