import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class JumpService {
  constructor(
    private router: Router,
  ) {}

  homePage() {
    return this.router.navigate(['/menu', 'home-page']);
  }

  appCenter() {
    return this.router.navigate(['/menu', 'app-center']);
  }

  userSetting() {
    return this.router.navigate(['/menu', 'user-setting']);
  }
}
