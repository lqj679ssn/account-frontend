import {Injectable} from '@angular/core';
import {LoadCallback} from '../models/load-callback';
import {ChooseItem} from '../models/choose-item';

@Injectable()
export class ReCAPTCHAService {
  public reCaptchaLC: LoadCallback;
  public regionList: Array<ChooseItem>;
  public regionLC: LoadCallback;

  constructor() {
    this.reCaptchaLC = new LoadCallback();
    this.regionList = [];
    this.regionLC = new LoadCallback();
  }

  loadedCallback() {
    this.reCaptchaLC.load();
  }
}
