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
      .catch(() => {
        this.toastService.show(new Toast('跳转失败'));
      });
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

  loginPage() {
    this.handler(['/user', 'login']);
  }
}
