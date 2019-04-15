import {Injectable} from '@angular/core';
import {LoadCallback} from '../models/load-callback';

@Injectable()
export class ReCAPTCHAService {
  public reCaptchaLC: LoadCallback;

  constructor() {
    this.reCaptchaLC = new LoadCallback();
  }

  loadedCallback() {
    this.reCaptchaLC.load();
  }
}
