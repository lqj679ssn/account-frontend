import {Component, ViewChild} from '@angular/core';
import {Radio, RadioList} from '../../models/radio';
import {UserService} from '../../services/user.service';
import {ImageSplitService} from '../../services/image-split.service';
import {Toast} from '../../models/toast';
import {ToastService} from '../../services/toast.service';
import {ImageSplitComponent} from '../base/image-split.component';
import {LoadingBoxComponent} from '../base/loading-box.component';
import {ChooseBoxComponent} from '../base/choose-box.component';
import {ClockService} from '../../services/clock.service';
import {ApiService} from '../../services/api.service';

@Component({
  templateUrl: './init-profile.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/app/apply.less',
    '../../../assets/styles/icomoon.css',
    '../../../assets/styles/mywebicon.css',
  ]
})
export class InitProfileComponent {
  @ViewChild('appImageSplit') appImageSplit: ImageSplitComponent;
  @ViewChild('loadingBox') loadingBox: LoadingBoxComponent;
  @ViewChild('chooseBox') chooseBox: ChooseBoxComponent;

  // ui
  magicScrollTop: number;
  showMagic: boolean;


  // user info section
  editUserInfo: boolean;
  userInfoRadioList: RadioList;
  userBirthdayRadio: Radio;
  userAvatarRadio: Radio;

  constructor(
    public userService: UserService,
    private toastService: ToastService,
    public clockService: ClockService,
    private api: ApiService,
  ) {
    this.showMagic = false;
    this.magicScrollTop = 80;

    // user info part
    this.editUserInfo = false;
    this.userBirthdayRadio = new Radio();
    this.userAvatarRadio = new Radio();
    this.userInfoRadioList = new RadioList([
      this.userBirthdayRadio,
      this.userAvatarRadio,
    ]);
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

  showBirthdayModifyHint() {
    if (!this.userService.user.isUnverified) {
      this.toastService.show(new Toast('实名认证或正在认证用户无法修改生日'));
    }
  }

  onScroll($event) {
    this.showMagic = $event.target.scrollTop >= this.magicScrollTop;
  }
}
