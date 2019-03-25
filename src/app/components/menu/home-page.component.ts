import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuFootBtnService} from '../../services/menu-foot-btn.service';
import {UserService} from '../../services/user.service';
import {AppDepotService} from '../../services/app-depot.service';
import {App} from '../../models/app';
import {DisplayComponent} from '../app/display.component';
import {ApiService} from '../../services/api.service';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/mywebicon.css',
  ]
})
export class HomePageComponent implements OnInit {
  @ViewChild('appDisplay') appDisplay: DisplayComponent;
  public app: App;
  public showDisplayPage: boolean;

  constructor(
    private footBtnService: MenuFootBtnService,
    public userService: UserService,
    public appDepot: AppDepotService,
    private api: ApiService,
  ) {
    this.app = new App({});
    this.showDisplayPage = false;
  }

  ngOnInit(): void {
    this.footBtnService.setActive(this.footBtnService.footBtnHomePage);

    this.appDepot.getFrequentAppList();
  }

  goOauthApp(app: App) {
    this.app = app;
    this.api.getAppInfo(app.app_id)
      .then(resp => {
        this.app = this.appDepot.push(resp);
      })
      .catch(this.api.defaultCatcher);
    this.showDisplayPage = true;
    this.appDisplay.initPage();
  }
}
