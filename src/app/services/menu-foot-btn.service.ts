import {MenuFootBtn} from '../models/menu-foot-btn';

export class MenuFootBtnService {
  footBtnHomePage: MenuFootBtn;
  footBtnAppCenter: MenuFootBtn;
  footBtnUserSetting: MenuFootBtn;
  footBtnList: Array<MenuFootBtn>;

  footBtnActive: MenuFootBtn;

  constructor() {
    this.footBtnHomePage = new MenuFootBtn({
      icon: 'icon-user',
      text: '主页',
      hide: false,
    });
    this.footBtnAppCenter = new MenuFootBtn({
      icon: 'icon-app',
      text: '广场',
      hide: false,
    });
    this.footBtnUserSetting = new MenuFootBtn({
      icon: 'icon-setting',
      text: '设置',
      hide: false,
    });

    this.footBtnList = [
      this.footBtnHomePage,
      this.footBtnAppCenter,
      this.footBtnUserSetting,
    ];
    this.setActive(this.footBtnHomePage);
  }

  setActive(footBtn: MenuFootBtn) {
    this.footBtnActive = footBtn;
  }

  get shownBtnList() {
    const shownBtnList = [];
    for (const footBtn of this.footBtnList) {
      if (!footBtn.hide) {
        shownBtnList.push(footBtn);
      }
    }
    return shownBtnList;
  }

  active(footBtn: MenuFootBtn) {
    return (this.footBtnActive === footBtn) ? 'active' : 'inactive';
  }
}
