import {Component, OnInit} from '@angular/core';
import {MenuFootBtnService} from '../../services/menu-foot-btn.service';
import {MenuFootBtn} from '../../models/menu-foot-btn';
import {Router} from '@angular/router';
import {JumpService} from '../../services/jump.service';
import {UserService} from '../../services/user.service';

@Component({
  templateUrl: './menu.component.html',
  styleUrls: [
    '../../../assets/styles/menu/footer.less',
    '../../../assets/styles/icomoon.css',
  ]
})
export class MenuComponent implements OnInit {
  constructor(
    public footBtnService: MenuFootBtnService,
    private router: Router,
    private jump: JumpService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (this.userService.userLC.loaded) {
      this.userLoadedCallback();
    } else {
      this.userService.userLC.calling(this.userLoadedCallback.bind(this));
    }
  }

  userLoadedCallback() {
    if (!this.userService.isLogin) {
      this.jump.loginPage();
    }
  }

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
