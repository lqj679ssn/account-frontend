import {Injectable} from '@angular/core';
import {App} from '../models/app';
import {ApiService} from './api.service';
import {LoadCallback} from '../models/load-callback';
import {ChooseItem} from '../models/choose-item';

@Injectable()
export class AppDepotService {
  private readonly _appDepot: object;
  public frequentAppList: Array<App>;

  public scopeList: Array<ChooseItem>;
  public premiseList: Array<ChooseItem>;
  public scopeLC: LoadCallback;
  public premiseLC: LoadCallback;

  constructor(
    private api: ApiService,
  ) {
    this._appDepot = {};
    this.frequentAppList = [];

    this.scopeList = [];
    this.premiseList = [];
    this.scopeLC = new LoadCallback();
    this.premiseLC = new LoadCallback();
  }

  push(app) {
    if (app.app_id in this._appDepot) {
      this._appDepot[app.app_id].update(app);
    } else {
      this._appDepot[app.app_id] = new App(app);
    }
    return this._appDepot[app.app_id];
  }

  getFrequentAppList() {
    this.api.getAppList({relation: 'user', frequent: true})
      .then(resp => {
        const newFrequentAppList = [];
        for (const app of resp) {
          const o_app = this.push(app);
          newFrequentAppList.push(o_app);
        }
        this.frequentAppList = newFrequentAppList;
      }).catch(this.api.defaultCatcher);
  }
}
