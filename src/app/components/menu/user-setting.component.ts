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
    this.verifyMode = UserSettingComponent.MODE_VERIFY_TO_UPLOAD;
    this.verifyInfoList = [
      {

      }, {
        'showVerifyButton': true,
        'verifyButtonText': '开始认证',
        'showOCRInfo': true,
      }, {
        'showVerifyButton': true,
        'verifyButtonText': '提交',
        'showOCRInfo': true,
      }
    ];
    this.cardFront = new Link();
    this.cardBack = new Link();
  }

  ngOnInit(): void {
    this.footBtnService.setActive(this.footBtnService.footBtnUserSetting);
  }

  get verifyInfoText() {
    if (this.userService.user && this.userService.user.verify_status === User.VERIFY_STATUS_DONE) {
      return '您已实名认证';
    } else {
      return '进行实名认证，体验更多精彩应用';
    }
  }

  /**
   * 个人信息板块
   */
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

  /**
   * 实名认证模块
   */
  uploadIDCard(files: FileList, back: number) {
    this.toastService.show(new Toast('正在上传证件'));
    if (files.length > 0) {
      if (files[0].size > ImageSplitService.MAX_IMAGE_SIZE) {
        this.toastService.show(new Toast(ImageSplitService.ERROR_TOO_LARGE_IMAGE_SIZE));
        return;
      } else {
        const file = files[0];
        this.api.getCardUploadToken({filename: file.name, back: back})
          .then(resp => {
            this.api.uploadFile({key: resp.key, token: resp.upload_token, file: file})
              .then(qnResp => {
                if (back) {
                  this.cardBack.link = qnResp;
                } else {
                  this.cardFront.link = qnResp;
                }
              });
          });
      }
    }
  }

  get editUserInfoText() {
    return UserSettingComponent.editText(this.editUserInfo);
  }

  /**
   * 账号信息模块
   */
  get editAccountInfoText() {
    return UserSettingComponent.editText(this.editAccountInfo);
  }
}
