import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {ImageSplitService} from '../../services/image-split.service';
import {fromEvent, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Point, Rect, Size} from '../../models/position';
import {OneWorker} from '../../services/one-worker.service';
import {Toast} from '../../models/toast';
import {dataURLtoFile, fileToBase64, fitStyle, getImageOrientation} from '../../services/common.service';
import {LoadingBoxComponent} from './loading-box.component';

@Component({
  selector: 'app-image-split',
  templateUrl: './image-split.component.html',
  styleUrls: [
    '../../../assets/styles/base/image-split.less',
  ]
})
export class ImageSplitComponent implements OnDestroy {
  constructor(
    public oneWorker: OneWorker,
  ) {
    this.imageLoaded = false;
    this.centerRect = new Rect();
    this.imageRect = new Rect();
    this.topLeftOffset = new Point();
    this.touchStatus = this.TOUCH_END;
  }
  private TOUCH_END = 0;
  private TOUCH_MOVE = 1;
  private TOUCH_RESIZE = 2;

  private MAX_SCALE = 16;

  @ViewChild('loadingBox') loadingBox: LoadingBoxComponent;
  @ViewChild('avatarCanvas') avatarCanvasElement: ElementRef;
  @ViewChild('centerBox') centerBoxElement: ElementRef;
  @ViewChild('touchBoard') touchBoardElement: ElementRef;
  @ViewChild('avatar') avatarElement: ElementRef;

  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private avatar: HTMLDivElement;
  private touch: HTMLDivElement;

  private image: HTMLImageElement;
  private imageLoaded: Boolean;
  private imageRect: Rect;
  private readonly centerRect: Rect;
  private maxSize: Size;
  private readonly topLeftOffset: Point;

  private touchStatus: number;
  private originPoints: Array<Point>;

  private showComponent: boolean;
  private fadeInComponent: boolean;

  imageFile: File;
  @Output() split = new EventEmitter<File>();

  _resizeSubscription: Subscription;

  hide() {
    this.fadeInComponent = false;
    setTimeout(() => {
      this.showComponent = false;
    }, 500);
  }

  show(imageFile: File): void {
    this.imageFile = imageFile;
    this.loadingBox.show('正在加载图片');
    this.showComponent = true;
    setTimeout(() => {
      this.fadeInComponent = true;

      this._resizeSubscription = fromEvent(window, 'resize')
        .pipe(debounceTime(300))
        .subscribe(() => {
          this.getElementSize();
          this.fitImageToCanvas(true);
        });

      this.canvas = this.avatarCanvasElement.nativeElement;

      this.avatar = this.avatarElement.nativeElement;
      this.touch = this.touchBoardElement.nativeElement;
      this.getElementSize();
      this.loadImage();
      this.addTouchEvents();
    }, 500);
  }

  addTouchEvents() {
    this.touch.addEventListener('mousedown', (e) => {
      this.originPoints = new Array<Point>();
      this.touchStatus = this.TOUCH_MOVE;
      this.originPoints.push(new Point(e.pageX, e.pageY).minus(this.topLeftOffset));
    });
    this.touch.addEventListener('mousemove', (e) => {
      const currentPoint: Point = new Point(e.pageX, e.pageY).minus(this.topLeftOffset);
      if (this.touchStatus === this.TOUCH_MOVE) {
        this.imageRect.left += currentPoint.x - this.originPoints[0].x;
        this.imageRect.top += currentPoint.y - this.originPoints[0].y;
        this.originPoints[0].beSameAs(currentPoint);
        this.fitImageToCanvas();
      }
    });
    this.touch.addEventListener('mouseup', () => {
      this.touchStatus = this.TOUCH_END;
    });
    this.touch.addEventListener('mousewheel', (e) => {
      let scale = 1;
      if (e.wheelDelta) {
        scale = -e.wheelDelta / 120;
      } else {
        scale = e.detail / 30;
      }
      scale = Math.pow(1.1, scale);
      const center = new Point(e.pageX, e.pageY).minus(this.topLeftOffset);
      this.imageRect.scale(center, scale, this.maxSize, this.centerRect.size);
      this.fitImageToCanvas();
    });
    this.touch.addEventListener('touchstart', (e) => {
      this.originPoints = new Array<Point>();
      if (e.touches.length === 0) {
        return;
      }
      this.originPoints.push(new Point(e.touches[0].pageX, e.touches[0].pageY).minus(this.topLeftOffset));
      if (e.touches.length === 1) {
        this.touchStatus = this.TOUCH_MOVE;
      } else {
        this.touchStatus = this.TOUCH_RESIZE;
        this.originPoints.push(new Point(e.touches[1].pageX, e.touches[1].pageY).minus(this.topLeftOffset));
      }
    });
    this.touch.addEventListener('touchmove', (e) => {
      const currentPoints: Array<Point> = new Array<Point>();
      if (this.touchStatus === this.TOUCH_END) {
        return;
      }
      e.preventDefault();
      currentPoints.push(new Point(e.touches[0].pageX, e.touches[0].pageY).minus(this.topLeftOffset));
      if (this.touchStatus === this.TOUCH_MOVE) {
        this.imageRect.left += currentPoints[0].x - this.originPoints[0].x;
        this.imageRect.top += currentPoints[0].y - this.originPoints[0].y;
        this.originPoints[0].beSameAs(currentPoints[0]);
      } else {
        currentPoints.push(new Point(e.touches[1].pageX, e.touches[1].pageY).minus(this.topLeftOffset));
        const originDist = this.originPoints[0].distTo(this.originPoints[1]);
        const currentDist = currentPoints[0].distTo(currentPoints[1]);
        let scale = currentDist / originDist;
        if (isNaN(scale) || scale === Infinity) {
          scale = 1;
        }
        const center = this.originPoints[0].middleWith(this.originPoints[1]);
        this.imageRect.scale(center, scale, this.maxSize, this.centerRect.size);
        this.originPoints[0].beSameAs(currentPoints[0]);
        this.originPoints[1].beSameAs(currentPoints[1]);
      }
      this.fitImageToCanvas();
    });
    this.touch.addEventListener('touchend', () => {
      this.touchStatus = this.TOUCH_END;
    });
  }

  loadImage() {
    const imageFile = this.imageFile;
    getImageOrientation(imageFile, (orientation) => {
      fileToBase64(imageFile, orientation, (orientedImageFile: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(orientedImageFile);
        reader.onload = (event) => {
          this.image = new Image();
          this.image.src = event.target.result;
          this.imageLoaded = false;
          this.image.onload = () => {
            this.imageLoaded = true;
            this.avatar.style.backgroundImage = `url(${this.image.src})`;
            this.maxSize = new Size(this.image.width, this.image.height);
            this.maxSize.scale(this.MAX_SCALE);
            this.imageRect.width = this.image.width;
            this.imageRect.height = this.image.height;
            this.loadingBox.hide();
            this.fitImageToCanvas(true);
          };
        };
      });
    });
  }

  getElementSize() {
    let centerBoxDiv = this.centerBoxElement.nativeElement;
    this.centerRect.setParam(
      centerBoxDiv.offsetTop,
      centerBoxDiv.offsetLeft,
      centerBoxDiv.offsetWidth,
      centerBoxDiv.offsetHeight
    );
    this.canvas.width = this.centerRect.width;
    this.canvas.height = this.centerRect.height;
    this.canvasContext = this.canvas.getContext('2d');

    this.avatar.style.width = fitStyle(this.centerRect.width);
    this.avatar.style.height = fitStyle(this.centerRect.height + centerBoxDiv.offsetTop * 2);

    this.topLeftOffset.setParam(0, 0);
    centerBoxDiv = centerBoxDiv.offsetParent;
    while (centerBoxDiv) {
      this.topLeftOffset.x += centerBoxDiv.offsetLeft;
      this.topLeftOffset.y += centerBoxDiv.offsetTop;
      centerBoxDiv = centerBoxDiv.offsetParent;
    }
  }

  fitImageToCanvas(initialize = false, from = this.TOUCH_MOVE) {
    // from 表示是从什么事件过来的
    if (!this.imageLoaded) {
      return;
    }
    if (initialize) {
      this.imageRect.totalFit(this.centerRect);
    }
    if (from === this.TOUCH_MOVE) {
      // 如果移动出界面，就平移回来
      this.imageRect.moveFill(this.centerRect);
    }
    if (from === this.TOUCH_RESIZE) {
      // 如果缩放过分，就自动填满
      this.imageRect.resizeFill(this.centerRect);
    }
    this.avatar.style.left = fitStyle(this.imageRect.left);
    this.avatar.style.top = fitStyle(this.imageRect.top);
    this.avatar.style.width = fitStyle(this.imageRect.width);
    this.avatar.style.height = fitStyle(this.imageRect.height);
  }

  returnSplitImage() {
    this.oneWorker.do('upload-avatar', (callback) => {
      const scale = this.imageRect.width / this.image.width;
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.drawImage(
        this.image,
        (this.centerRect.left - this.imageRect.left) / scale,
        (this.centerRect.top - this.imageRect.top) / scale,
        this.centerRect.width / scale,
        this.centerRect.height / scale,
        0,
        0,
        this.centerRect.width,
        this.centerRect.height);
      const dataURL = this.canvas.toDataURL('image/jpeg');
      const file = dataURLtoFile(dataURL, 'split-image');
      this.hide();
      callback();
      this.split.emit(file);
    }, new Toast(ImageSplitService.ERROR_IS_UPLOADING));
  }

  ngOnDestroy(): void {
    if (this._resizeSubscription) {
      this._resizeSubscription.unsubscribe();
    }
  }
}
