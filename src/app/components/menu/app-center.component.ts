import {Component, OnDestroy, ViewChild} from '@angular/core';
import {AppDepotService} from '../../services/app-depot.service';
import {App} from '../../models/app';
import {JumpService} from '../../services/jump.service';
import {MenuFootBtnService} from '../../services/menu-foot-btn.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ApiService} from '../../services/api.service';
import {DisplayComponent} from '../app/display.component';
import {UserService} from '../../services/user.service';
import {HistoryService} from '../../services/history.service';

@Component({
  templateUrl: './app-center.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/mywebicon.css',
  ]
})
export class AppCenterComponent implements OnDestroy {
  @ViewChild('appDisplay') appDisplay: DisplayComponent;
  public app: App;
  public appId: string;
  public showDisplayPage: boolean;

  public oauth: boolean;

  _routerSubscription: Subscription;
  _querySubscription: Subscription;

  constructor(
    public appDepot: AppDepotService,
    private jump: JumpService,
    public footBtnService: MenuFootBtnService,
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private history: HistoryService,
  ) {
    this._routerSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.app = this.appDepot.appTemplate;
        this.showDisplayPage = false;

        this._querySubscription = this.activatedRoute.queryParams.subscribe((params) => {
          this.oauth = this.activatedRoute.snapshot.data['oauth'];
          if (!this.oauth) {
            return;
          }
          this.appId = params['app_id'];
          this.api.getAppInfo(this.appId)
            .then(resp => {
              this.app = this.appDepot.push(resp);
              this.appDisplay.initPage(this.app);
              this.showDisplayPage = true;
            }).catch(this.api.defaultCatcher);
        });

        this.footBtnService.setActive(this.footBtnService.footBtnAppCenter);
        this.appDepot.getTotalAppList();
        this.appDepot.getDevAppList();
      }
    });
  }

  goOauthApp(app: App) {
    this.jump.appCenterOauthApp(app.app_id);
  }

  goManageApp(app: App) {
    this.jump.appManage(app.app_id);
  }

  onAppBack() {
    this._querySubscription.unsubscribe();
    this._routerSubscription.unsubscribe();
    this.history.go(this.jump.homePage.bind(this.jump));
  }

  ngOnDestroy(): void {
    this._querySubscription.unsubscribe();
    this._routerSubscription.unsubscribe();
  }
}
