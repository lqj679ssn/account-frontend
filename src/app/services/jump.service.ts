import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastService} from './toast.service';
import {Toast} from '../models/toast';

@Injectable()
export class JumpService {
  constructor(
    private router: Router,
    private toastService: ToastService,
  ) {}

  handler(commands, params = null) {
    this.router.navigate(commands, {queryParams: params})
      .then()
      .catch((e) => {
        console.log(e);
        this.toastService.show(new Toast('跳转失败'));
      });
  }

  outsideHandler(link) {
    window.location.href = link;
  }

  homePage() {
    this.handler(['/menu', 'home-page']);
  }

  appCenter() {
    this.handler(['/menu', 'app-center']);
  }

  userSetting() {
    this.handler(['/menu', 'user-setting']);
  }

  oauthApp(appId) {
    this.handler(['/oauth'], {app_id: appId});
  }

  homePageOauthApp(appId) {
    this.handler(['/menu', 'home-page', 'oauth'], {app_id: appId});
  }

  appCenterOauthApp(appId) {
    this.handler(['/menu', 'app-center', 'oauth'], {app_id: appId});
  }

  loginPage() {
    this.handler(['/user', 'login']);
  }

  appApply() {
    this.handler(['/app', 'apply']);
  }

  appUpdate(appId) {
    this.handler(['/app', 'update'], {app_id: appId});
  }

  createIssue() {
    this.outsideHandler('https://github.com/lqj679ssn/account-frontend/issues/new');
  }

  viewCode() {
    this.outsideHandler('https://github.com/lqj679ssn/account-frontend');
  }

  mailMe() {
    this.outsideHandler('mailto:i@6-79.cn');
  }
}
