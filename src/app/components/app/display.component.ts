import {Component, Input, ViewChild} from '@angular/core';
import {App} from '../../models/app';
import {Radio, RadioList} from '../../models/radio';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {ToastService} from '../../services/toast.service';
import {OneWorker} from '../../services/one-worker.service';
import {Toast} from '../../models/toast';
import {ScoreBoxComponent} from '../base/score-box.component';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/app/app.less',
    '../../../assets/styles/app/display.less',
    '../../../assets/styles/icomoon.css',
  ]
})
export class DisplayComponent {
  @Input() app: App;
  @Input() showPage: boolean;
  @Input() childMode: boolean;

  @ViewChild('appScoreBox') appScoreBox: ScoreBoxComponent;

  foldInfo: boolean;

  appInfoRadioList: RadioList;
  appScopes: Radio;
  appPremises: Radio;

  magicScrollTop: number;
  showMagic: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private toastService: ToastService,
    private oneWorker: OneWorker,
  ) {
    this.foldInfo = true;

    this.appScopes = new Radio();
    this.appPremises = new Radio();
    this.appInfoRadioList = new RadioList([
      this.appScopes,
      this.appPremises,
    ]);

    this.magicScrollTop = 111;
    this.showMagic = false;
  }

  initPage() {
    if (this.app.relation.rebind) {
      this.toastService.show(new Toast('应用信息变更，请重新授权'));
    }
  }

  // info fold
  get foldText() {
    return this.foldInfo ? '展开' : '收起';
  }

  onScroll($event) {
    this.showMagic = $event.target.scrollTop >= this.magicScrollTop;
  }

  oauthApp() {
    this.oneWorker.do('oauth-app', (callback) => {
      this.api.oauthApp({app_id: this.app.app_id})
        .then(resp => {
          callback();
          window.location.href = `${this.app.redirect_uri}?code=${resp.auth_code}`;
        })
        .catch(() => {
          callback();
        });
    });
  }
}
