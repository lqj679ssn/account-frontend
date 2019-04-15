import {Component, OnInit} from '@angular/core';
import { ClockService } from './services/clock.service';
import {ReCAPTCHAService} from './services/recaptcha.service';
import {ApiService} from './services/api.service';
import {PreloadImage} from './models/preload-image';
import {UserService} from './services/user.service';
import {User} from './models/user';
import {AppDepotService} from './services/app-depot.service';
import {ChooseItem} from './models/choose-item';
import {RegionService} from './services/region.service';

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
    private regionService: RegionService,
    private reCAPTCHAService: ReCAPTCHAService,
    private api: ApiService,
    private userService: UserService,
    private appDepot: AppDepotService,
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
      }).catch();

    // try login with user-token
    if (this.userService.tokenLC.loaded) {
      this.loginWithUserToken();
    } else {
      this.userService.tokenLC.calling(this.loginWithUserToken.bind(this));
    }

    // get scope and premise list
    this.api.getAppScope()
      .then((scopes) => {
        this.appDepot.scopeList = [];
        for (const scope of scopes) {
          this.appDepot.scopeList.push(ChooseItem.fromScope(scope));
        }
        this.appDepot.scopeLC.load();
      });

    this.api.getAppPremise()
      .then((premises) => {
        this.appDepot.premiseList = [];
        for (const premise of premises) {
          this.appDepot.premiseList.push(ChooseItem.fromPremise(premise));
        }
        this.appDepot.premiseLC.load();
      });

    // get region list
    this.api.getRegions()
      .then((countries) => {
        this.regionService.regionList = [];
        for (let i = 0; i < countries.length; i++) {
          const country = countries[i];
          this.regionService.regionList.push(new ChooseItem({
            key: '+' + country.num,
            value: country.name + ' ' + country.flag,
            id: '' + i,
          }));
        }
        this.regionService.regionList[0].selected = true;
        this.regionService.regionLC.load();
      }).catch(this.api.defaultCatcher);
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
      }).catch(() => {
        this.userService.user = new User({});
    });
  }
}
