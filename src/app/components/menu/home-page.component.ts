import {Component, OnDestroy, ViewChild} from '@angular/core';
import {MenuFootBtnService} from '../../services/menu-foot-btn.service';
import {UserService} from '../../services/user.service';
import {AppDepotService} from '../../services/app-depot.service';
import {App} from '../../models/app';
import {DisplayComponent} from '../app/display.component';
import {ApiService} from '../../services/api.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {JumpService} from '../../services/jump.service';
import {Subscription} from 'rxjs';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/mywebicon.css',
  ]
})
export class HomePageComponent implements OnDestroy {
  @ViewChild('appDisplay') appDisplay: DisplayComponent;
  public app: App;
  public appId: string;
  public showDisplayPage: boolean;

  public oauth: boolean;

  _routerObserver: Subscription;
  _queryObserver: Subscription;

  constructor(
    private footBtnService: MenuFootBtnService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    public appDepot: AppDepotService,
    private api: ApiService,
    private jump: JumpService,
  ) {
    this._routerObserver = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.app = this.appDepot.appTemplate;
        this.showDisplayPage = false;

        this._queryObserver = this.activatedRoute.queryParams.subscribe((params) => {
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

        this.footBtnService.setActive(this.footBtnService.footBtnHomePage);
        this.appDepot.getFrequentAppList();
      }
    });
  }

  goOauthApp(app: App) {
    // this.app = app;
    // this.api.getAppInfo(app.app_id)
    //   .then(resp => {
    //     this.app = this.appDepot.push(resp);
    //   })
    //   .catch(this.api.defaultCatcher);
    // this.showDisplayPage = true;
    // this.appDisplay.initPage();
    this._queryObserver.unsubscribe();
    this._routerObserver.unsubscribe();
    this.jump.homePageOauthApp(app.app_id);
  }

  ngOnDestroy(): void {
    this._queryObserver.unsubscribe();
    this._routerObserver.unsubscribe();
  }
}
