import {Injectable} from '@angular/core';
import {App} from '../models/app';
import {ApiService} from './api.service';
import {LoadCallback} from '../models/load-callback';
import {ChooseItem} from '../models/choose-item';

@Injectable()
export class AppDepotService {
  private readonly _appDepot: object;
  public frequentAppList: Array<App>;
  public totalAppList: Array<App>;
  public devAppList: Array<App>;
  public lastCreateTime: 0;

  public scopeList: Array<ChooseItem>;
  public premiseList: Array<ChooseItem>;
  public scopeLC: LoadCallback;
  public premiseLC: LoadCallback;
  public appTemplate: App;

  constructor(
    private api: ApiService,
  ) {
    this._appDepot = {};
    this.frequentAppList = [];
    this.totalAppList = [];
    this.lastCreateTime = 0;

    this.scopeList = [];
    this.premiseList = [];
    this.scopeLC = new LoadCallback();
    this.premiseLC = new LoadCallback();

    this.appTemplate = new App({});
  }

  push(app, base = false) {
    if (app.app_id in this._appDepot) {
      this._appDepot[app.app_id].update(app, base);
    } else {
      this._appDepot[app.app_id] = new App(app);
    }
    return this._appDepot[app.app_id];
  }

  get(appId) {
    return this._appDepot[appId] || new App({});
  }

  getFrequentAppList() {
    this.api.getAppList({relation: 'user', frequent: true})
      .then(resp => {
        const newFrequentAppList = [];
        for (const app of resp) {
          const o_app = this.push(app, true);
          newFrequentAppList.push(o_app);
        }
        this.frequentAppList = newFrequentAppList;
      }).catch(this.api.defaultCatcher);
  }

  getTotalAppList() {
    this.api.getAppList({relation: 'none', frequent: false, last_time: this.lastCreateTime, count: 10})
      .then(resp => {
        for (const app of resp) {
          const o_app = this.push(app, true);
          this.totalAppList.push(o_app);
          if (o_app.create_time > this.lastCreateTime) {
            this.lastCreateTime = o_app.create_time;
          }
        }
      }).catch(this.api.defaultCatcher);
  }

  getDevAppList() {
    this.api.getAppList({relation: 'owner'})
      .then(resp => {
        const newDevAppList = [];
        for (const app of resp) {
          const o_app = this.push(app, true);
          newDevAppList.push(o_app);
        }
        this.devAppList = newDevAppList;
      }).catch(this.api.defaultCatcher);
  }
}
