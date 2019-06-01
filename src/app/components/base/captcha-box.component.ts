import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ReCAPTCHA} from '../../models/recaptcha';
import {ReCAPTCHAService} from '../../services/recaptcha.service';

declare var grecaptcha: ReCAPTCHA;

@Component({
  selector: 'app-captcha-box',
  templateUrl: './captcha-box.component.html',
  styleUrls: [
    '../../../assets/styles/base/captcha-box.less',
  ]
})
export class CaptchaBoxComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  @Output() submit = new EventEmitter<string>();

  // ReCaptcha component
  @ViewChild('gReCaptcha') gReCaptcha: ElementRef;

  showCaptchaBox: boolean;
  fadeInCaptchaBox: boolean;
  rendered: boolean;

  constructor(
    private reCAPTCHAService: ReCAPTCHAService,
  ) {
    this.rendered = false;
    this.hide();
  }

  ngOnInit(): void {
    // render ReCaptcha
    if (this.reCAPTCHAService.reCaptchaLC.loaded) {
      this.renderReCAPTCHA();
    } else {
      this.reCAPTCHAService.reCaptchaLC.calling(this.renderReCAPTCHA.bind(this));
    }
  }

  renderReCAPTCHA() {
    this.rendered = true;
    window['reCAPTCHACallback'] = this._submit.bind(this);
    grecaptcha.render(this.gReCaptcha.nativeElement, {
      'callback': 'reCAPTCHACallback'
    });
  }

  _cancel() {
    this.hide();
    this.cancel.emit();
  }

  _submit() {
    this.hide();
    this.submit.emit(grecaptcha.getResponse());
  }

  show() {
    if (this.rendered) {
      grecaptcha.reset();
    }
    this.showCaptchaBox = true;
    setTimeout(() => {
      this.fadeInCaptchaBox = true;
    }, 500);
  }

  hide() {
    this.fadeInCaptchaBox = false;
    setTimeout(() => {
      this.showCaptchaBox = false;
    }, 500);
  }
}
