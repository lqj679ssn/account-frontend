import {Component} from '@angular/core';
import {MenuFootBtnService} from '../../services/menu-foot-btn.service';
import {MenuFootBtn} from '../../models/menu-foot-btn';
import {Router} from '@angular/router';
import {JumpService} from '../../services/jump.service';

@Component({
  templateUrl: './menu.component.html',
  styleUrls: [
    '../../../assets/styles/menu/footer.less',
    '../../../assets/styles/icomoon.css',
  ]
})
export class MenuComponent {
  constructor(
    public footBtnService: MenuFootBtnService,
    private router: Router,
    private jump: JumpService,
  ) {}

  activateBtn(footBtn: MenuFootBtn) {
    switch (footBtn) {
      case this.footBtnService.footBtnHomePage:
        this.jump.homePage();
        break;
      case this.footBtnService.footBtnAppCenter:
        this.jump.appCenter();
        break;
      case this.footBtnService.footBtnUserSetting:
        this.jump.userSetting();
        break;
    }
  }
}
