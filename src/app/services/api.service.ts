import {Injectable} from '@angular/core';
import {RequestService} from './request.service';

@Injectable()
export class ApiService {
  constructor(
    private requestService: RequestService,
  ) {}

  public getRegions() {
    return this.requestService
      .get('/api/base/regions');
  }

  public getRandomImage() {
    return this.requestService
      .get('https://unsplash.6-79.cn/random/info');
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

  public getAppList(data) {
    return this.requestService
      .get('/api/app/', data);
  }
}
