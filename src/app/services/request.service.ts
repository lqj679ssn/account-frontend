import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ToastService} from './toast.service';
import {Toast} from '../models/toast';
// import {ProgressHttp} from 'angular-progress-http';

@Injectable()
export class RequestService {

  constructor(
    private http: HttpClient,
    // private processHttp: ProgressHttp,
    private toastService: ToastService,
  ) {}
  public static token: string = null;
  public static api_host = 'https://ssoapi.6-79.cn';

  public static async_worker = 0;

  private static handleError(error: any): Promise<any> {
    RequestService.async_worker -= 1;
    console.error(error);
    return Promise.reject(error);
  }

  static get_option(data = {}) {
    const httpHeaders = new HttpHeaders({'Token': RequestService.token || ''});
    return {
      headers: httpHeaders,
      params: data,
    };
  }

  static fillUrl(url: string) {
    if (url[0] === '/') {
      return RequestService.api_host + url;
    } else {
      return url;
    }
  }

  private handleHTTP(o: Observable<Object>) {
    return o.toPromise()
      .then((resp: any) => {
        if (resp.code !== 0) {
          this.toastService.show(new Toast(resp.msg));
          return Promise.reject(resp.msg);
        } else {
          RequestService.async_worker -= 1;
          return resp.body;
        }
      })
      .catch(RequestService.handleError);
  }
  private handleProcessHTTP(o: Observable<Object>) {
    return o.toPromise()
      .then((resp: any) => {
        resp = JSON.parse(resp._body);
        if (resp.code !== 0) {
          this.toastService.show(new Toast(resp.msg));
          return Promise.reject(resp.msg);
        } else {
          RequestService.async_worker -= 1;
          return resp.body;
        }
      })
      .catch(RequestService.handleError);
  }

  get(url: string, data: object = null) {
    RequestService.async_worker += 1;
    return this.handleHTTP(this.http.get(RequestService.fillUrl(url), RequestService.get_option(data)));
  }
  post(url: string, data) {
    RequestService.async_worker += 1;
    return this.handleHTTP(this.http.post(RequestService.fillUrl(url), data, RequestService.get_option()));
  }
  put(url: string, data) {
    RequestService.async_worker += 1;
    return this.handleHTTP(this.http.put(RequestService.fillUrl(url), data, RequestService.get_option()));
  }
  del(url: string) {
    RequestService.async_worker += 1;
    return this.handleHTTP(this.http.delete(RequestService.fillUrl(url), RequestService.get_option()));
  }
}
