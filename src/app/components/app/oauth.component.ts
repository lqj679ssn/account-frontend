import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {App} from '../../models/app';
import {ApiService} from '../../services/api.service';
import {DisplayComponent} from './display.component';
import {AppDepotService} from '../../services/app-depot.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/app/app.less',
    '../../../assets/styles/icomoon.css',
  ]
})
export class OauthComponent implements OnInit {
  @ViewChild('appDisplay') appDisplay: DisplayComponent;

  appId: string;
  app: App;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    public appDepot: AppDepotService,
  ) {
    this.app = new App({});
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.appId = params['app_id'];
      this.api.getAppInfo( this.appId)
        .then(resp => {
          this.app = this.appDepot.push(resp);
          this.appDisplay.initPage();
        }).catch(this.api.defaultCatcher);
    });
  }
}
