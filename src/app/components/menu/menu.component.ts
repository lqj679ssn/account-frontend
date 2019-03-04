import {Component} from '@angular/core';
import {MenuFootBtnService} from '../../services/menu-foot-btn.service';
import {MenuFootBtn} from '../../models/menu-foot-btn';
import {Router} from '@angular/router';

@Component({
  templateUrl: './menu.component.html',
  styleUrls: [
    '../../../assets/styles/menu/footer.less',
    '../../../assets/styles/icomoon.css',
  ]
})
export class MenuComponent {
  constructor(
    private footBtnService: MenuFootBtnService,
    private router: Router,
  ) {}

  activateBtn(footBtn: MenuFootBtn) {
    switch (footBtn) {
      case this.footBtnService.footBtnHomePage:
        this.router.navigate(['/menu', 'home-page'])
          .then();
        break;
      case this.footBtnService.footBtnAppCenter:
        this.router.navigate(['/menu', 'app-center'])
          .then();
        break;
      case this.footBtnService.footBtnUserSetting:
        this.router.navigate(['/menu', 'user-setting'])
          .then();
        break;
    }
  }
}
