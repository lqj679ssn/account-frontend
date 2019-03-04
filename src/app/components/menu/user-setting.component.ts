import {Component, OnInit} from '@angular/core';
import {ClockService} from '../../services/clock.service';
import {AvatarSplitService} from '../../services/avatar-split.service';
import {ToastService} from '../../services/toast.service';
import {Router} from '@angular/router';
import {Toast} from '../../models/toast';
import {MenuFootBtnService} from '../../services/menu-foot-btn.service';

@Component({
  templateUrl: './user-setting.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
  ]
})
export class UserSettingComponent implements OnInit {
  avatarUploader: HTMLInputElement;

  constructor(
    public clockService: ClockService,
    public avatarSplitService: AvatarSplitService,
    public toastService: ToastService,
    public router: Router,
    private footBtnService: MenuFootBtnService,
  ) {}

  ngOnInit(): void {
    this.footBtnService.setActive(this.footBtnService.footBtnUserSetting);
  }

  chooseAvatarImage(files: FileList) {
    if (files.length > 0) {
      if (files[0].size > AvatarSplitService.MAX_IMAGE_SIZE) {
        this.avatarUploader.value = null;
        this.toastService.show(new Toast(AvatarSplitService.ERROR_TOO_LARGE_IMAGE_SIZE));
        return;
      }
      this.avatarSplitService.avatar_file = files[0];
      this.router.navigate(['base', 'avatar', 'cut']);
    }
  }
}
