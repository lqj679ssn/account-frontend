import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Toast} from '../models/toast';

@Injectable()
export class ToastService {
  private toastCenter: Subject<Toast>;

  constructor() {
    this.toastCenter = new Subject<Toast>();
  }

  show(toast: Toast) {
    this.toastCenter.next(toast);
  }

  listen(handler) {
    this.toastCenter.asObservable()
      .subscribe(handler);
  }
}
