import {Component, OnInit} from '@angular/core';
import { ClockService } from './services/clock.service';
import {ReCAPTCHAService} from './services/recaptcha.service';
import {ApiService} from './services/api.service';
import {PreloadImage} from './models/preload-image';
import {UserService} from './services/user.service';
import {User} from './models/user';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    '../assets/styles/app.less',
  ]
})
export class AppComponent implements OnInit {
  smallImage: PreloadImage;
  regularImage: PreloadImage;

  constructor(
    private reCAPTCHAService: ReCAPTCHAService,
    private api: ApiService,
    private userService: UserService,
  ) {
    ClockService.startClock();
  }

  ngOnInit(): void {
    window['onloadCallback'] = this.reCAPTCHAService.loadedCallback.bind(this.reCAPTCHAService);

    this.api.getRandomImage()
      .then((resp) => {
        this.smallImage = new PreloadImage(resp.thumb);
        this.regularImage = new PreloadImage(resp.regular);
        this.smallImage.load(() => {
          this.regularImage.load(null);
        });
      });

    // try login with user-token
    if (this.userService.tokenLC.loaded) {
      this.loginWithUserToken();
    } else {
      this.userService.tokenLC.callback = this.loginWithUserToken.bind(this);
    }
  }

  get backgroundImage() {
    let src = '';
    if (this.regularImage && this.regularImage.loaded) {
      src = this.regularImage.src;
    } else if (this.smallImage && this.smallImage.loaded) {
      src =  this.smallImage.src;
    }
    return `url('${src}')`;
  }

  loginWithUserToken() {
    this.api.getMyInfo()
      .then(resp => {
        this.userService.user = new User(resp);
      })
      .catch();
  }
}
