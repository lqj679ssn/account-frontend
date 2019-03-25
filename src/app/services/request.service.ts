import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ToastService} from './toast.service';
import {Toast} from '../models/toast';
import {HttpCallback} from '../models/httpCallback';
// import {ProgressHttp} from 'angular-progress-http';

@Injectable()
export class RequestService {

  constructor(
    private http: HttpClient,
    // private processHttp: ProgressHttp,
    private toastService: ToastService,
  ) {}
  public static token: string = null;
  public static api_host = 'https://sso.6-79.cn';
  // public static api_host = 'http://localhost:8001';
  // public static api_host = 'http://172.20.10.3:8001';

  public static async_worker = 0;

  private static handleError(error: any): Promise<any> {
    RequestService.async_worker -= 1;
    // console.error(error);
    return Promise.reject(error);
  }

  static getOption(url, data = {}) {
    const httpHeaders = new HttpHeaders({'Token': this.isSSOServer(url) ? (RequestService.token || '') : ''});
    return {
      headers: httpHeaders,
      params: data,
      withCredentials: this.isSSOServer(url),
    };
  }

  static getOptionV2(url, data: any = null) {
    const httpHeaders = new HttpHeaders({'Token': this.isSSOServer(url) ? (RequestService.token || '') : ''});
    return {
      headers: httpHeaders,
      params: data,
      withCredentials: this.isSSOServer(url),
      reportProgress: true,
      // responseType: 'json',
    };
  }

  static isSSOServer(url: string) {
    return url[0] === '/';
  }

  static fillUrl(url: string) {
    if (this.isSSOServer(url)) {
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
            return Promise.reject(resp);
          } else {
            RequestService.async_worker -= 1;
            return resp.body;
          }
        }).catch(RequestService.handleError);
  }

  private handleHTTPV2(o: Observable<object>, callback: HttpCallback) {
    o.subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('upload');
      } else if (event.type === HttpEventType.DownloadProgress) {
        console.log('download');
      } else if (event.type === HttpEventType.Response) {
        console.log('response');
        const resp = event.body;
        if (resp.code !== 0) {
          this.toastService.show(new Toast(resp.msg));
        } else {
          callback.responseCallback.run(resp.body);
        }
      }
    });
  }

  get(url: string, data: object = null) {
    RequestService.async_worker += 1;
    return this.handleHTTP(this.http.get(RequestService.fillUrl(url), RequestService.getOption(url, data)));
  }
  post(url: string, data) {
    RequestService.async_worker += 1;
    return this.handleHTTP(this.http.post(RequestService.fillUrl(url), data, RequestService.getOption(url)));
  }
  put(url: string, data) {
    RequestService.async_worker += 1;
    return this.handleHTTP(this.http.put(RequestService.fillUrl(url), data, RequestService.getOption(url)));
  }
  del(url: string) {
    RequestService.async_worker += 1;
    return this.handleHTTP(this.http.delete(RequestService.fillUrl(url), RequestService.getOption(url)));
  }

  getV2(url: string, data: object = null, callback: HttpCallback) {
    this.handleHTTPV2(this.http.get(RequestService.fillUrl(url), RequestService.getOptionV2(url, data)), callback);
  }

  postV2(url: string, data: object = null, callback: HttpCallback) {
    const request = new HttpRequest('POST', RequestService.fillUrl(url), data, RequestService.getOptionV2(url, data));
    this.handleHTTPV2(this.http.request(request), callback);
  }

  putV2(url: string, data: object = null, callback: HttpCallback) {
    this.handleHTTPV2(this.http.put(RequestService.fillUrl(url), data, RequestService.getOptionV2(url)), callback);
  }

  delV2(url: string, callback: HttpCallback) {
    this.handleHTTPV2(this.http.delete(RequestService.fillUrl(url), RequestService.getOptionV2(url)), callback);
  }
}
