import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {JumpService} from '../../services/jump.service';
import {AppDepotService} from '../../services/app-depot.service';
import {ChooseItem} from '../../models/choose-item';
import {ChooseBoxComponent} from '../base/choose-box.component';
import {Radio, RadioList} from '../../models/radio';
import {App} from '../../models/app';
import {Toast} from '../../models/toast';
import {ToastService} from '../../services/toast.service';
import {ApiService} from '../../services/api.service';
import {ImageSplitComponent} from '../base/image-split.component';
import {ImageSplitService} from '../../services/image-split.service';

@Component({
  templateUrl: './apply.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/app/apply.less',
    '../../../assets/styles/icomoon.css',
    '../../../assets/styles/mywebicon.css',
  ]
})
export class ApplyComponent implements OnInit {
  @ViewChild('chooseBox') chooseBox: ChooseBoxComponent;
  chooseList: Array<ChooseItem>;
  chooseBoxTitle: string;
  _chooseBoxOnSubmit: any;
  _chooseBoxOnCancel: any;

  oauthInfoRadioList: RadioList;
  oauthScope: Radio;
  oauthPremise: Radio;

  @ViewChild('appImageSplit') appImageSplit: ImageSplitComponent;
  appInfoRadioList: RadioList;
  appLogo: Radio;
  logoUploader: HTMLInputElement;

  // step
  modeRadioList: RadioList;
  firstMode: Radio;
  secondMode: Radio;

  // params
  app: App;

  // ui
  magicScrollTop: number;
  showMagic: boolean;

  constructor(
    public userService: UserService,
    private appDepot: AppDepotService,
    private jump: JumpService,
    private toastService: ToastService,
    private api: ApiService,
  ) {
    this.showMagic = false;
    this.magicScrollTop = 80;

    this.chooseList = [];
    this.chooseBoxTitle = '';

    this.oauthScope = new Radio();
    this.oauthPremise = new Radio();
    this.oauthInfoRadioList = new RadioList([
      this.oauthScope,
      this.oauthPremise,
    ]);

    this.appLogo = new Radio();
    this.appInfoRadioList = new RadioList([
      this.appLogo,
    ]);

    this.firstMode = new Radio();
    this.secondMode = new Radio();
    this.modeRadioList = new RadioList([
      this.firstMode,
      this.secondMode,
    ]);
    this.modeRadioList.toggle(this.firstMode);

    this.app = new App({});
  }

  ngOnInit(): void {
    // detect if login
    if (this.userService.userLC.loaded) {
      this.userLoadedCallback();
    } else {
      this.userService.userLC.calling(this.userLoadedCallback.bind(this));
    }

    if (this.appDepot.scopeLC.loaded) {
      this.scopeLoadedCallback();
    } else {
      this.appDepot.scopeLC.calling(this.scopeLoadedCallback.bind(this));
    }

    if (this.appDepot.premiseLC.loaded) {
      this.premiseLoadedCallback();
    } else {
      this.appDepot.premiseLC.calling(this.premiseLoadedCallback.bind(this));
    }
  }

  /**
   * callbacks for detecting user login, scope loaded and premise loaded
   */
  userLoadedCallback() {
    if (!this.userService.isLogin) {
      this.jump.loginPage();
    }
  }

  scopeLoadedCallback() {
    this.app.scopes = [];
    for (const scope of this.appDepot.scopeList) {
      if (scope.selected || scope.always) {
        this.app.scopes.push(scope);
      }
    }
  }

  premiseLoadedCallback() {
    this.app.premises = [];
    for (const premise of this.appDepot.premiseList) {
      if (premise.selected || premise.always) {
        this.app.premises.push(premise);
      }
    }
  }

  /**
   * chooseBox show and submit/onCancel handler
   */
  chooseScope() {
    this.chooseBoxTitle = '选择权限';
    this.chooseList = this.appDepot.scopeList;
    this.chooseBox.show();
    this._chooseBoxOnSubmit = this.chooseScopeOnSubmit.bind(this);
  }

  choosePremise() {
    this.chooseBoxTitle = '选择要求';
    this.chooseList = this.appDepot.premiseList;
    this.chooseBox.show();
    this._chooseBoxOnSubmit = this.choosePremiseOnSubmit.bind(this);
  }

  chooseScopeOnSubmit(scopes) {
    this.app.scopes = scopes;
  }

  choosePremiseOnSubmit(premises) {
    this.app.premises = premises;
  }

  chooseBoxOnSubmit($event) {
    if (this._chooseBoxOnSubmit) {
      this._chooseBoxOnSubmit($event);
    }
  }

  chooseBoxOnCancel() {
    if (this._chooseBoxOnCancel) {
      this._chooseBoxOnCancel();
    }
  }

  /**
   * pageText
   */
  get scopeText() {
    const length = this.app.scopes.length;
    return length ? `已选择${length}项权限…` : '选择权限…';
  }

  get premiseText() {
    const length = this.app.premises.length;
    return length ? `已选择${length}项要求…` : '选择要求…';
  }

  /**
   * create using api
   */
  paramValid(param, text) {
    if (!param || param.length === 0) {
      this.toastService.show(new Toast(`${text}不能为空`));
      return false;
    }
    return true;
  }
  checkInputValid() {
    return this.paramValid(this.app.app_name, '应用名称') &&
      this.paramValid(this.app.app_desc, '应用标语') &&
      this.paramValid(this.app.redirect_uri, '回调URI');
  }

  createNewApp() {
    if (!this.checkInputValid()) {
      return;
    }

    const scopeList = [];
    const premiseList = [];
    for (const scope of this.app.scopes) {
      scopeList.push(scope.id);
    }
    for (const premise of this.app.premises) {
      premiseList.push(premise.id);
    }

    this.api.createNewApp({
      name: this.app.app_name || '',
      desc: this.app.app_desc || '',
      info: this.app.app_info || '',
      redirect_uri: this.app.redirect_uri || '',
      test_redirect_uri: this.app.test_redirect_uri || '',
      scopes: scopeList,
      premises: premiseList,
    }).then(resp => {
        this.app = new App(resp);
        this.modeRadioList.toggle(this.secondMode);
      });
  }

  updateAppInfo() {
    if (!this.paramValid(this.app.app_info, '应用介绍')) {
      return;
    }
    this.api.updateAppInfo(this.app).then(resp => {
      this.app = this.appDepot.push(resp);
      this.jump.appCenter();
    });
  }

  /**
   * 更新logo
   */
  chooseLogoImage(files: FileList) {
    if (files.length > 0) {
      if (files[0].size > ImageSplitService.MAX_IMAGE_SIZE) {
        this.logoUploader.value = null;
        this.toastService.show(new Toast(ImageSplitService.ERROR_TOO_LARGE_IMAGE_SIZE));
        return;
      } else {
        this.appImageSplit.show(files[0]);
      }
    }
  }

  uploadLogo(file: File) {
    this.api.getLogoUploadToken({filename: file.name, app_id: this.app.app_id})
      .then(resp => {
        this.api.uploadFile({key: resp.key, token: resp.upload_token, file: file})
          .then(qnResp => {
            this.app = this.appDepot.push(qnResp);
          });
      });
  }

  onScroll($event) {
    this.showMagic = $event.target.scrollTop >= this.magicScrollTop;
  }
}
