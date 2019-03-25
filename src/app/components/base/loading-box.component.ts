import {Component} from '@angular/core';

@Component({
  selector: 'app-loading-box',
  templateUrl: './loading-box.component.html',
  styleUrls: [
    '../../../assets/styles/base/loading-box.less',
  ]
})
export class LoadingBoxComponent {
  showLoadingBox: boolean;
  fadeInLoadingBox: boolean;
  loadingText: string;

  constructor() {
    this.loadingText = null;
    this.fadeInLoadingBox = false;
    this.showLoadingBox = false;
  }

  hide() {
    this.fadeInLoadingBox = false;
    setTimeout(() => {
      this.showLoadingBox = false;
    }, 500);
  }

  show(text: string = null) {
    this.loadingText = text;
    this.showLoadingBox = true;
    setTimeout(() => {
      this.fadeInLoadingBox = true;
    }, 500);
  }
}
