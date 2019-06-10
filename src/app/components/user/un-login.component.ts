import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {ChooseItem} from '../../models/choose-item';
import {ToastService} from '../../services/toast.service';
import {Toast} from '../../models/toast';
import {ChooseBoxComponent} from '../base/choose-box.component';
import {CaptchaBoxComponent} from '../base/captcha-box.component';
import {LoadingBoxComponent} from '../base/loading-box.component';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {JumpService} from '../../services/jump.service';
import {template} from '../../services/common.service';
import {OneWorker} from '../../services/one-worker.service';
import {RegionService} from '../../services/region.service';
import {HistoryService} from '../../services/history.service';

@Component({
  templateUrl: './un-login.component.html',
  styleUrls: [
    '../../../assets/styles/user/un-login.less',
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/mywebicon.css',
    '../../../assets/styles/icomoon.css',
  ]
})
export class UnLoginComponent implements OnInit {
  public static MODE_LOGIN_PHONE_CODE = 0;
  public static MODE_LOGIN_PHONE_PWD = 1;
  public static MODE_LOGIN_QTB_PWD = 2;
  public static MODE_REGISTER = 3;
  public static MODE_FIND_PWD = 4;
  public static MODE_LOGIN_CODE = 5;
  public static MODE_REGISTER_CODE = 6;
  public static MODE_FIND_PWD_CODE = 7;

  public mode: number;
  public pageTextList: Array<any>;
  public subTitleTemplate;

  // loading-box component
  @ViewChild('loadingBox') loadingBox: LoadingBoxComponent;

  // captcha-box component
  @ViewChild('captchaBox') captchaBox: CaptchaBoxComponent;

  // region choose-box component
  @ViewChild('chooseBox') chooseBox: ChooseBoxComponent;
  public currentRegionCode: string;
  public chooseList: Array<ChooseItem>;

  // phone input
  @ViewChild('phoneInput') phoneInput: ElementRef;

  // input value
  public phoneNumber: string;
  public qtID: string;
  public password: string;
  public verifiedCode: string;
  public lastVerifiedCode: string;

  // password eye-open or eye-close
  public showPassword: boolean;

  constructor(
    private regionService: RegionService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private api: ApiService,
    private userService: UserService,
    private jump: JumpService,
    private router: Router,
    private oneWorker: OneWorker,
    private history: HistoryService,
  ) {
    this.initStatusList();
    // region choose-box
    this.currentRegionCode = '+86';
    this.subTitleTemplate = template`我们向${0}发送了一个验证码，请在下方输入`;
    this.verifiedCode = null;
    this.lastVerifiedCode = null;
    this.showPassword = false;
  }

  initStatusList() {
    this.pageTextList = [
      {
        title: '登录齐天簿',
        mainTitle: '手机动态密码登录',
        subTitle: '输入手机号，点击右下角箭头获取动态密码',
        showPhoneBox: true,
        showGoRegister: true,
        showPWDLogin: true,
      }, {
        title: '登录齐天簿',
        mainTitle: '普通账号密码登录',
        subTitle: '输入手机号和密码，点击右下角箭头登录',
        showPhoneBox: true,
        showUseQT: true,
        showPWDBox: true,
        pwdText: '密码',
        showForgetPWD: true,
        showGoRegister: true,
        showCodeLogin: true,
      }, {
        title: '登录齐天簿',
        mainTitle: '普通账号密码登录',
        subTitle: '输入齐天号和密码，点击右下角箭头登录',
        showPhoneBox: false,
        showQTBox: true,
        showPWDBox: true,
        pwdText: '密码',
        showForgetPWD: true,
        showGoRegister: true,
        showCodeLogin: true,
      }, {
        title: '加入齐天簿',
        mainTitle: '手机号注册',
        subTitle: '输入手机号，点击右下角箭头进行动态验证',
        showPhoneBox: true,
        showGoLogin: true,
      }, {
        title: '找回密码',
        mainTitle: '手机号动态验证',
        subTitle: '输入手机号，点击右下角箭头进行动态验证',
        showPhoneBox: true,
        showGoRegister: true,
        showGoLogin: true,
      }, {
        title: '登录齐天簿',
        mainTitle: '输入6位验证码',
        subTitle: null,
        showCodeBox: true,
      }, {
        title: '加入齐天簿',
        mainTitle: '输入6位验证码',
        subTitle: null,
        showCodeBox: true,
        showPWDBox: true,
        pwdText: '设置密码',
      }, {
        title: '找回密码',
        mainTitle: '输入6位验证码',
        subTitle: null,
        showPWDBox: true,
        pwdText: '设置新密码',
        showCodeBox: true,
      }
    ];
  }

  ngOnInit(): void {
    this.mode = this.activatedRoute.snapshot.data['mode'];

    // detect if login
    if (this.userService.userLC.loaded) {
      this.userLoadedCallback();
    } else {
      this.userService.userLC.calling(this.userLoadedCallback.bind(this));
    }

    // detect region list loaded
    if (this.regionService.regionLC.loaded) {
      this.regionLoadedCallback();
    } else {
      this.regionService.regionLC.calling(this.regionLoadedCallback.bind(this));
    }
  }

  regionLoadedCallback() {
    this.chooseList = this.regionService.regionList;
    this.currentRegionCode = this.chooseList[0].key;
  }

  userLoadedCallback() {
    if (this.userService.isLogin) {
      this.history.go(this.jump.homePage.bind(this.jump));
    }
  }

  get pageText() {
    return this.pageTextList[this.mode];
  }

  /**
   * 设置mode函数，赋值之外对subTitle进行赋值
   */
  get isPhoneCodeMode() {
    return [
      UnLoginComponent.MODE_LOGIN_PHONE_CODE,
      UnLoginComponent.MODE_REGISTER,
      UnLoginComponent.MODE_FIND_PWD,
    ].includes(this.mode);
  }
  get isPasswordMode() {
    return [
      UnLoginComponent.MODE_LOGIN_PHONE_PWD,
      UnLoginComponent.MODE_LOGIN_QTB_PWD,
    ].includes(this.mode);
  }
  get isCodeInputMode() {
    return [
      UnLoginComponent.MODE_LOGIN_CODE,
      UnLoginComponent.MODE_REGISTER_CODE,
      UnLoginComponent.MODE_FIND_PWD_CODE,
    ].includes(this.mode);
  }
  setMode(mode) {
    this.mode = mode;
    if (this.isCodeInputMode) {
      this.pageTextList[mode].subTitle = this.subTitleTemplate(this.phoneNumber);
    }
    this.verifiedCode = null;
  }

  /**
   * 按钮点击事件
   */
  goRegister() {
    this.setMode(UnLoginComponent.MODE_REGISTER);
  }
  goLogin() {
    this.setMode(UnLoginComponent.MODE_LOGIN_PHONE_PWD);
  }
  goFindPWD() {
    this.setMode(UnLoginComponent.MODE_FIND_PWD);
  }
  pwdLogin() {
    this.setMode(UnLoginComponent.MODE_LOGIN_PHONE_PWD);
  }
  codeLogin() {
    this.setMode(UnLoginComponent.MODE_LOGIN_PHONE_CODE);
  }
  qtLogin() {
    this.setMode(UnLoginComponent.MODE_LOGIN_QTB_PWD);
  }

  /**
   * 下一步按钮处理
   */
  get showIconBoxLeft() {
    return this.isCodeInputMode;
  }
  paramValid(param, modeList, text) {
    for (const mode of modeList) {
      if (this.mode === mode) {
        if (!param || param.length === 0) {
          this.toastService.show(new Toast(`${text}不能为空`));
          return false;
        }
      }
    }
    return true;
  }
  checkInputValid() {
    if (!this.paramValid(
      this.phoneNumber, [
        UnLoginComponent.MODE_LOGIN_PHONE_CODE,
        UnLoginComponent.MODE_LOGIN_PHONE_PWD,
        UnLoginComponent.MODE_REGISTER,
        UnLoginComponent.MODE_FIND_PWD
      ], '手机号')
    ) {
      return false;
    }
    if (!this.paramValid(
      this.password, [
        UnLoginComponent.MODE_LOGIN_PHONE_PWD,
        UnLoginComponent.MODE_LOGIN_QTB_PWD,
        UnLoginComponent.MODE_FIND_PWD_CODE,
        UnLoginComponent.MODE_REGISTER_CODE,
      ], '密码')
    ) {
      return false;
    }
    if (!this.paramValid(
      this.qtID, [
        UnLoginComponent.MODE_LOGIN_QTB_PWD
      ], '齐天号')
    ) {
      return false;
    }
    return this.paramValid(
      this.verifiedCode, [
        UnLoginComponent.MODE_LOGIN_CODE,
        UnLoginComponent.MODE_REGISTER_CODE,
        UnLoginComponent.MODE_FIND_PWD_CODE,
      ], '验证码'
    );
  }
  goBack() {
    switch (this.mode) {
      case UnLoginComponent.MODE_LOGIN_CODE:
        this.setMode(UnLoginComponent.MODE_LOGIN_PHONE_CODE);
        break;
      case UnLoginComponent.MODE_REGISTER_CODE:
        this.setMode(UnLoginComponent.MODE_REGISTER);
        break;
      case UnLoginComponent.MODE_FIND_PWD_CODE:
        this.setMode(UnLoginComponent.MODE_FIND_PWD);
        break;
    }
  }
  buttonDealer() {
    if (this.isCodeInputMode) {
      this.goBack();
    } else {
      if (this.checkInputValid()) {
        this.captchaBox.show();
      }
    }
  }
  codeListener() {
    if (('' + this.verifiedCode).length === 6) {
      if (this.verifiedCode === this.lastVerifiedCode) {
        return;
      }
      if (!this.checkInputValid()) {
        return;
      }
      this.oneWorker.do('get-login-token-using-code', (callback) => {
        this.lastVerifiedCode = this.verifiedCode;
        // this.loadingBox.show('正在验证…');
        this.api.getLoginTokenUsingCode({
          mode: this.mode,
          code: this.verifiedCode,
          pwd: this.password,
        }).then((resp) => {
          // this.loadingBox.hide();
          callback();
          this.userService.user = new User(resp.user);
          this.userService.token = resp.token;
          this.history.go(this.jump.homePage.bind(this.jump));
        }).catch(() => {
          callback();
          // this.loadingBox.hide();
          this.goBack();
        });
      });
    }
  }

  /**
   * 重新获取验证码
   */
  getCodeAgain() {
    this.goBack();
    this.buttonDealer();
  }

  /**
   * 选择手机地域
   */
  chooseRegion() {
    if (this.regionService.regionLC.loaded) {
      this.chooseBox.show();
    } else {
      this.toastService.show(new Toast('正在加载，请稍后'));
    }
  }
  chooseBoxOnSubmit(chooseItems: Array<ChooseItem>) {
    this.currentRegionCode = chooseItems[0].key;
    this.toastService.show(new Toast(`切换手机号所在地为${chooseItems[0].value}`));
    this.phoneInput.nativeElement.focus();
  }
  chooseBoxOnCancel() {
    this.phoneInput.nativeElement.focus();
  }

  get wholePhoneNumber() {
    return this.currentRegionCode + this.phoneNumber;
  }

  /**
   * 人机验证
   */
  captchaBoxOnSubmit(response: string) {
    if (this.isPhoneCodeMode) {
      this.api.getPhoneCode({
        mode: this.mode,
        response: response,
        phone: this.wholePhoneNumber,
      }).then((resp) => {
        this.setMode(resp.next_mode);
        if (resp.toast_msg.length > 0) {
          this.toastService.show(new Toast(resp.toast_msg));
        }
      }).catch(this.api.defaultCatcher);
    } else if (this.isPasswordMode) {
      this.api.getLoginTokenUsingPWD({
        mode: this.mode,
        response: response,
        phone: this.wholePhoneNumber,
        qt: this.qtID,
        pwd: this.password,
      }).then((resp) => {
        this.userService.user = new User(resp.user);
        this.userService.token = resp.token;
        this.history.go(this.jump.homePage.bind(this.jump));
      }).catch(this.api.defaultCatcher);
    }
  }
}
