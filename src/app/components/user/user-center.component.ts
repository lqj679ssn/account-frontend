import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ClockService } from '../../services/clock.service';
import {AvatarSplitService} from '../../services/avatar-split.service';
import {Router} from '@angular/router';
import {ToastService} from '../../services/toast.service';
import {Toast} from '../../models/toast';
import {Rect, Size} from '../../models/position';
import {fitStyle} from '../../services/common.service';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  templateUrl: './user-center.component.html',
  styleUrls: [
    '../../../assets/styles/user/center.less',
    '../../../assets/styles/base/animate-button.less',
  ]
})
export class UserCenterComponent implements OnInit {
  static SCALE = 0.8;
  static SKEWY = 20;

  @ViewChild('measureContainer') measureContainerElement: ElementRef;
  @ViewChild('mainContainer') mainContainerElement: ElementRef;
  @ViewChild('avatarUploader') avatarUploaderElement: ElementRef;
  @ViewChild('menuContainer') menuContainerElement: ElementRef;
  avatarUploader: HTMLInputElement;
  containerSize: Size;
  mainContainer: HTMLDivElement;
  menuContainer: HTMLDivElement;
  measureContainer: HTMLDivElement;

  heightOffset: number;
  topOffset: number;
  private _showMenu: Boolean;
  get showMenu(): Boolean {
    return this._showMenu;
  }

  set showMenu(value: Boolean) {
    this._showMenu = value;
    this.changeShowMenuState();
  }

  constructor(
    public clockService: ClockService,
    public avatarSplitService: AvatarSplitService,
    public toastService: ToastService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.avatarUploader = this.avatarUploaderElement.nativeElement;
    this.mainContainer = this.mainContainerElement.nativeElement;
    this.measureContainer = this.measureContainerElement.nativeElement;
    this.menuContainer = this.menuContainerElement.nativeElement;

    this.containerSize = new Size();
    this.styleRefresher();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.styleRefresher();
      });

    this.showMenu = false;
    // setInterval(() => {this.showMenu = !this.showMenu; }, 1000);
  }

  styleRefresher() {
    this.containerSize.setParam(
      this.measureContainer.offsetWidth,
      this.measureContainer.offsetHeight
    );
    const widthOffset = this.containerSize.w * UserCenterComponent.SCALE / 2;
    this.heightOffset = Math.tan(UserCenterComponent.SKEWY * Math.PI / 180) * widthOffset;
    this.topOffset = this.containerSize.h * (1 - UserCenterComponent.SCALE) / 2;
    this.changeShowMenuState();
  }

  changeShowMenuState() {
    if (this._showMenu) {
      this.mainContainer.style.top = fitStyle(-this.heightOffset);
      this.menuContainer.style.top = fitStyle(this.topOffset);
    } else {
      this.mainContainer.style.top = null;
      this.menuContainer.style.top = null;
    }
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
