import {Component, OnInit, ViewChild} from '@angular/core';
import {ClockService} from '../../services/clock.service';
import {ImageSplitService} from '../../services/image-split.service';
import {ToastService} from '../../services/toast.service';
import {Router} from '@angular/router';
import {Toast} from '../../models/toast';
import {MenuFootBtnService} from '../../services/menu-foot-btn.service';
import {UserService} from '../../services/user.service';
import {Radio, RadioList} from '../../models/radio';
import {ImageSplitComponent} from '../base/image-split.component';
import {ApiService} from '../../services/api.service';
import {LoadingBoxComponent} from '../base/loading-box.component';
import {User} from '../../models/user';
import {Link} from '../../models/link';
import {PreloadImage} from '../../models/preload-image';
import {OneWorker} from '../../services/one-worker.service';
import {IDCard} from '../../models/IDCard';
import {ChooseItem} from '../../models/choose-item';
import {ChooseBoxComponent} from '../base/choose-box.component';
import {JumpService} from '../../services/jump.service';
import {HttpCallback} from '../../models/http-callback';
// import {HttpCallback} from '../../models/httpCallback';

@Component({
  templateUrl: './user-setting.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/icomoon.css',
  ]
})
export class UserSettingComponent implements OnInit {
  public static MODE_VERIFY_TO_UPLOAD = 0;
  public static MODE_VERIFY_TO_VERIFY = 1;
  public static MODE_VERIFY_TO_SUBMIT = 2;

  @ViewChild('appImageSplit') appImageSplit: ImageSplitComponent;
  @ViewChild('loadingBox') loadingBox: LoadingBoxComponent;
  @ViewChild('chooseBox') chooseBox: ChooseBoxComponent;

  // avatarUploader: HTMLInputElement;
  // cardFrontUploader: HTMLInputElement;
  // cardBackUploaded: HTMLInputElement;

  // user info section
  editUserInfo: boolean;
  userInfoRadioList: RadioList;
  userNicknameRadio: Radio;
  userDescRadio: Radio;
  userBirthdayRadio: Radio;
  userAvatarRadio: Radio;
  userQitianRadio: Radio;

  // account info section
  editAccountInfo: boolean;
  accountInfoRadioList: RadioList;
  accountPhoneRadio: Radio;
  accountVerifyRadio: Radio;
  accountDevRadio: Radio;

  // verify
  verifyMode: number;
  verifyInfoList: Array<any>;
  cardFront: Link;
  cardBack: Link;
  idCard: IDCard;
  idCardOld: IDCard;
  verifyButtonText: string;
  interval: number;
  sexChooseList: Array<ChooseItem>;
  uploadFrontPercentage: number;
  uploadFront: boolean;
  uploadFrontText: string;
  uploadBackPercentage: number;
  uploadBack: boolean;
  uploadBackText: string;

  static editText(edit: boolean) {
    return edit ? '完成' : '编辑';
  }

  constructor(
    private api: ApiService,
    public clockService: ClockService,
    private imageSplitService: ImageSplitService,
    public toastService: ToastService,
    public router: Router,
    private footBtnService: MenuFootBtnService,
    public userService: UserService,
    private oneWorker: OneWorker,
    public jump: JumpService,
  ) {
    // user info part
    this.editUserInfo = false;
    this.userNicknameRadio = new Radio();
    this.userDescRadio = new Radio();
    this.userBirthdayRadio = new Radio();
    this.userAvatarRadio = new Radio();
    this.userQitianRadio = new Radio();
    this.userInfoRadioList = new RadioList([
      this.userNicknameRadio,
      this.userDescRadio,
      this.userBirthdayRadio,
      this.userAvatarRadio,
      this.userQitianRadio,
    ]);

    // account info part
    this.accountPhoneRadio = new Radio();
    this.accountVerifyRadio = new Radio();
    this.accountDevRadio = new Radio();
    this.accountInfoRadioList = new RadioList([
      this.accountPhoneRadio,
      this.accountVerifyRadio,
      this.accountDevRadio,
    ]);

    // verify
    // this.verifyMode = UserSettingComponent.MODE_VERIFY_TO_UPLOAD;
    this.setVerifyMode(UserSettingComponent.MODE_VERIFY_TO_UPLOAD);
    this.verifyButtonText = null;
    this.interval = null;
    this.verifyInfoList = [
      {
        'noteText': '*暂时只支持中国大陆持有居民身份证的用户进行认证',
      }, {
        'showVerifyButton': true,
        'noteText': '*暂时只支持中国大陆持有居民身份证的用户进行认证',
      }, {
        'showVerifyButton': true,
        'showOCRInfo': true,
        'noteText': '*自动识别出的信息如果有误，请手动更改',
      }
    ];
    this.cardFront = new Link();
    this.cardBack = new Link();
    this.uploadFront = false;
    this.uploadBack = false;
    this.updateUploadText();

    this.sexChooseList = [
      new ChooseItem({key: '男', id: 'male', value: null, always: null, desc: null, descRight: null, selected: null}),
      new ChooseItem({key: '女', id: 'female', value: null, always: null, desc: null, descRight: null, selected: null})
    ];
  }

  ngOnInit(): void {
    this.footBtnService.setActive(this.footBtnService.footBtnUserSetting);
  }

  get verifyInfoText() {
    if (this.userService.user.isVerified) {
      return '您已实名认证';
    } else if (this.userService.user.isUnverified) {
      return '进行实名认证，体验更多精彩应用';
    } else if (this.userService.user.isAutoVerifying) {
      return '正在自动验证';
    } else if (this.userService.user.isManualVerifying) {
      return '正在人工验证';
    }
  }

  /**
   * 个人信息板块
   */
  showQitianModifyHint() {
    if (!this.userService.user.allow_qitian_modify) {
      this.toastService.show(new Toast('您已使用修改齐天号的机会'));
    }
  }

  showBirthdayModifyHint() {
    if (!this.userService.user.isUnverified) {
      this.toastService.show(new Toast('实名认证或正在认证用户无法修改生日'));
    }
  }

  chooseAvatarImage(files: FileList) {
    if (files.length > 0) {
      if (files[0].size > ImageSplitService.MAX_IMAGE_SIZE) {
        // this.avatarUploader.value = null;
        this.toastService.show(new Toast(ImageSplitService.ERROR_TOO_LARGE_IMAGE_SIZE));
        return;
      } else {
        this.appImageSplit.show(files[0]);
        // this.uploadAvatar(files[0]);
      }
    }
  }

  uploadAvatar(file: File) {
    this.toastService.show(new Toast('正在上传头像'));
    this.api.getAvatarUploadToken({filename: file.name})
      .then(resp => {
        this.api.uploadFile({key: resp.key, token: resp.upload_token, file: file})
          .then(qnResp => {
            this.userService.user.update(qnResp);
          });
      });
  }

  get editUserInfoText() {
    return UserSettingComponent.editText(this.editUserInfo);
  }

  updateUserInfo() {
    this.editUserInfo = !this.editUserInfo;
    if (!this.editUserInfo) {
      this.api.updateUserInfo({
        nickname: this.userService.user.nickname,
        description: this.userService.user.description,
        qitian: this.userService.user.qitian,
        birthday: this.userService.user.birthday,
      }).then(resp => {
        this.userService.user.update(resp);
        this.toastService.show(new Toast('修改个人信息成功'));
      }).catch(() => {
        this.userService.restoreBackUp();
      });
    }
  }

  cancelUpdateUserInfo() {
    this.editUserInfo = false;
    this.userService.restoreBackUp();
  }

  /**
   * 账号信息模块
   */
  get editAccountInfoText() {
    return UserSettingComponent.editText(this.editAccountInfo);
  }

  /**
   * 实名认证模块
   */
  setVerifyMode(mode) {
    this.verifyMode = mode;
    switch (this.verifyMode) {
      case UserSettingComponent.MODE_VERIFY_TO_VERIFY:
        this.verifyButtonText = '开始认证';
        break;
      case UserSettingComponent.MODE_VERIFY_TO_SUBMIT:
        clearInterval(this.interval);
        this.interval = setInterval(this.intervalHandler.bind(this), 1000);
        this.intervalHandler();
        break;
    }
  }

  intervalHandler() {
    const remainTime = this.idCard.expireTime - ClockService.cTimestamp;
    if (remainTime <= 0) {
      clearInterval(this.interval);
      this.setVerifyMode(UserSettingComponent.MODE_VERIFY_TO_VERIFY);
    } else {
      this.verifyButtonText = `提交（${remainTime.toFixed(0)}s）`;
    }
  }

  modeUpdate() {
    if (this.verifyMode === UserSettingComponent.MODE_VERIFY_TO_UPLOAD) {
      if (this.cardBack.link && this.cardFront.link) {
        this.setVerifyMode(UserSettingComponent.MODE_VERIFY_TO_VERIFY);
      }
    }
  }

  uploadIDCard(files: FileList, back: number) {
    if (files.length <= 0) {
      return;
    }
    if (files[0].size > ImageSplitService.MAX_IMAGE_SIZE) {
      this.toastService.show(new Toast(ImageSplitService.ERROR_TOO_LARGE_IMAGE_SIZE));
      return;
    }

    this.oneWorker.do('upload-card', (callback) => {
      const file = files[0];
      if (back) {
        this.uploadBack = true;
        this.uploadBackPercentage = 0;
        this.cardBack = new Link();
      } else {
        this.uploadFront = true;
        this.uploadFrontPercentage = 0;
        this.cardFront = new Link();
      }
      this.updateUploadText();
      this.api.getCardUploadToken({filename: file.name, back: back})
        .then(resp => {
          this.api.uploadFileV2(
            {key: resp.key, token: resp.upload_token, file: file},
            new HttpCallback({
              responseCallback: (qnResp) => {
                const preloadImage = new PreloadImage(qnResp);
                preloadImage.load(() => {
                  if (back) {
                    this.cardBack.link = qnResp;
                  } else {
                    this.cardFront.link = qnResp;
                  }
                  this.modeUpdate();
                });
                this.uploadBack = false;
                this.uploadFront = false;
                callback();
              },
              uploadProgress: (event) => {
                const percentage = Math.round(event.loaded / event.total * 100);
                if (back) {
                  this.uploadBackPercentage = percentage;
                } else {
                  this.uploadFrontPercentage = percentage;
                }
                this.updateUploadText();
              },
              failResponseCallback: () => {
                if (back) {
                  this.uploadBackText = '上传失败，请重试';
                } else {
                  this.uploadFrontText = '上传失败，请重试';
                }
                callback();
              }
            }));
        }).catch(callback);
    }, new Toast('正在上传证件'));
  }

  updateUploadText() {
    if (this.uploadFront) {
      this.uploadFrontText = `上传中（${this.uploadFrontPercentage}%）`;
    } else {
      this.uploadFrontText = '上传身份证肖像面';
    }
    if (this.uploadBack) {
      this.uploadBackText = `上传中（${this.uploadBackPercentage}%）`;
    } else {
      this.uploadBackText = '上传身份证国徽面';
    }
  }

  verifyButtonClick() {
    this.oneWorker.do('idcard-verify', (callback) => {
      if (this.verifyMode === UserSettingComponent.MODE_VERIFY_TO_VERIFY) {
        this.api.autoVerify()
          .then(resp => {
            this.idCard = new IDCard(resp);
            this.idCardOld = new IDCard(resp);
            this.sexChooseList[Number(!this.idCard.male)].selected = true;
            this.sexChooseList[Number(this.idCard.male)].selected = false;
            this.setVerifyMode(UserSettingComponent.MODE_VERIFY_TO_SUBMIT);
            callback();
          })
          .catch(callback);
      } else if (this.verifyMode === UserSettingComponent.MODE_VERIFY_TO_SUBMIT) {
        clearInterval(this.interval);
        this.verifyButtonText = '正在提交';
        let promise: Promise<any>;
        if (this.idCard.male === this.idCardOld.male &&
          this.idCard.birthday === this.idCardOld.birthday &&
          this.idCard.real_name === this.idCardOld.real_name &&
          this.idCard.idcard === this.idCardOld.idcard
        ) {
          promise = this.api.confirmVerify({token: this.idCard.token});
        } else {
          promise = this.api.confirmVerify({
            name: this.idCard.real_name,
            birthday: this.idCard.birthday,
            idcard: this.idCard.idcard,
            male: this.idCard.male,
            auto: false,
          });
        }
        promise.then(resp => {
          this.userService.user.update(resp);
          this.accountInfoRadioList.deactivate(this.accountVerifyRadio);
          let toastString;
          switch (this.userService.user.verify_status) {
            case User.VERIFY_STATUS_UNDER_MANUAL:
              toastString = '正在人工验证';
              break;
            case User.VERIFY_STATUS_UNDER_AUTO:
              toastString = '正在进行验证';
              break;
            case User.VERIFY_STATUS_DONE:
              toastString = '实名验证成功';
              break;
          }
          this.toastService.show(new Toast(toastString));
          callback();
        }).catch(callback);
      } else {
        callback();
      }
    }, new Toast('正在处理操作'));
  }

  chooseSexOnSubmit(chosenList: Array<ChooseItem>) {
    console.log(chosenList);
    this.idCard.male = chosenList[0].id === 'male';
  }

  chooseSex() {
    this.chooseBox.show();
  }

  /**
   * Developer Area
   */

  get applyDevText() {
    if (this.userService.user.isVerified) {
      return '立即申请';
    } else {
      return '无法申请';
    }
  }

  get applyDevNote() {
    if (this.userService.user.isUnverified) {
      return '实名认证后才能申请开发者';
    } else {
      return '恭喜！您拥有开发者申请资格';
    }
  }

  applyDev() {
    if (this.userService.user.isUnverified) {
      return;
    }
    this.api.applyDev()
      .then(resp => {
        this.userService.user.update(resp);
        this.toastService.show(new Toast('开发者申请成功'));
      }).catch(this.api.defaultCatcher);
  }

  applyApp() {
    this.jump.appApply();
  }
}
