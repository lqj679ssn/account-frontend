import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {RespError} from '../models/resp-error';
import {JumpService} from './jump.service';
import {HttpCallback} from '../models/http-callback';
import {App} from '../models/app';

@Injectable()
export class ApiService {
  public static qn_host = 'https://up.qiniup.com';

  constructor(
    private requestService: RequestService,
    private jump: JumpService,
  ) {}

  get defaultCatcher() {
    return this._defaultCatcher.bind(this);
  }

  private static packForm(data: {key, token, file}) {
    const formData = new FormData();
    formData.append('key', data.key);
    formData.append('token', data.token);
    formData.append('file', data.file);
    return formData;
  }

  private _defaultCatcher(respError: RespError) {
    if (RespError.JUMP_LOGIN_PAGE_ERRORS.includes(respError.identifier)) {
      this.jump.loginPage();
    }
  }

  public getRegions() {
    return this.requestService
      .get('/api/base/regions');
  }

  public getPhoneCode(data: {mode, phone, response}) {
    return this.requestService
      .post('/api/base/recaptcha', data);
  }

  public getLoginTokenUsingPWD(data: {mode, phone, qt, response, pwd}) {
    return this.requestService
      .post('/api/base/recaptcha', data);
  }

  public getLoginTokenUsingCode(data: {mode, code, pwd}) {
    return this.requestService
      .post('/api/base/recaptcha', data);
  }

  public getMyInfo() {
    return this.requestService
      .get('/api/user/');
  }

  public getAppList(data: {relation, frequent?, count?, last_time?}) {
    return this.requestService
      .get('/api/app/', data);
  }

  public getAppInfo(appId) {
    return this.requestService
      .get(`/api/app/${appId}`);
  }

  public getAppSecret(appId) {
    return this.requestService
      .get(`/api/app/${appId}/secret`);
  }

  public oauthApp(data: {app_id}) {
    return this.requestService
      .post('/api/oauth/', data);
  }

  public getAppScope() {
    return this.requestService
      .get('/api/app/scope');
  }

  public getAppPremise() {
    return this.requestService
      .get('/api/app/premise');
  }

  public createNewApp(data: {name, info, desc, redirect_uri, test_redirect_uri, scopes, premises}) {
    return this.requestService
      .post('/api/app/', data);
  }

  public getLogoUploadToken(data: {filename, app_id}) {
    return this.requestService
      .get('/api/app/logo', data);
  }

  public getAvatarUploadToken(data: {filename}) {
    return this.requestService
      .get('/api/user/avatar', data);
  }

  public uploadFile(data: {key, token, file}) {
    const formData = ApiService.packForm(data);
    return this.requestService
      .post(ApiService.qn_host, formData);
  }

  public uploadFileV2(data: {key, token, file}, callback: HttpCallback) {
    const formData = ApiService.packForm(data);
    return this.requestService
      .postV2(ApiService.qn_host, formData, callback);
  }

  public updateAppInfo(app: App) {
    const scopeList = [];
    const premiseList = [];
    for (const scope of app.scopes) {
      scopeList.push(scope.id);
    }
    for (const premise of app.premises) {
      premiseList.push(premise.id);
    }

    return this.requestService
      .put(`/api/app/${app.app_id}`, {
        name: app.app_name || '',
        desc: app.app_desc || '',
        info: app.app_info || '',
        redirect_uri: app.redirect_uri || '',
        test_redirect_uri: app.test_redirect_uri || '',
        scopes: scopeList,
        premises: premiseList
      });
  }

  public updateScore(appUserId, data: {mark}) {
    return this.requestService
      .put(`/api/app/user/${appUserId}`, data);
  }

  public getCardUploadToken(data: {filename, back}) {
    return this.requestService
      .get('/api/user/idcard', data);
  }

  public autoVerify() {
    return this.requestService
      .get('/api/user/verify', {});
  }

  public confirmVerify(data: {name?, birthday?, idcard?, male?, token?, auto?}) {
    return this.requestService
      .post('/api/user/verify', data);
  }

  public updateUserInfo(data: {nickname?, description?, qitian?, birthday?}) {
    return this.requestService
      .put('/api/user/', data);
  }

  public applyDev() {
    return this.requestService
      .post('/api/user/dev', {});
  }
}
