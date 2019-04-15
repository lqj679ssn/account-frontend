import {Injectable} from '@angular/core';
import {ChooseItem} from '../models/choose-item';
import {LoadCallback} from '../models/load-callback';

@Injectable()
export class RegionService {
  public regionList: Array<ChooseItem>;
  public regionLC: LoadCallback;

  constructor() {
    this.regionList = [];
    this.regionLC = new LoadCallback();
  }
}
