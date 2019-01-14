import {Component} from '@angular/core';
import {ToastService} from '../../services/toast.service';
import {Toast} from '../../models/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: [
    '../../../assets/styles/base/toast.less',
  ]
})
export class ToastComponent {
  static TRANSITION_DURATION = 500;

  activeToast: Boolean;
  toastText: string;
  interval: number;

  constructor(
    private toastService: ToastService,
  ) {
    this.activeToast = false;
    this.interval = null;
    toastService.listen(this.handler.bind(this));
  }

  handler(toast: Toast) {
    this.toastText = toast.text;
    this.activeToast = true;
    if (toast.time !== Toast.TIME_ALWAYS) {
      clearInterval(this.interval);
      this.interval = setInterval(
        this.clearToast.bind(this),
        toast.time + ToastComponent.TRANSITION_DURATION
      );
    }
  }

  b2s(b: Boolean) {
    return b ? 'active' : 'inactive';
  }

  clearToast() {
    clearInterval(this.interval);
    this.activeToast = false;
  }
}
