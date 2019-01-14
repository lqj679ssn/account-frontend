import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AvatarSplitService} from '../../services/avatar-split.service';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Point, Rect, Size} from '../../models/position';
import {OneWorker} from '../../services/one-worker.service';
import {Toast} from '../../models/toast';
import {dataURLtoFile, fitStyle} from '../../services/common.service';

@Component({
  templateUrl: './avatar-split.component.html',
  styleUrls: [
    '../../../assets/styles/base/avatar-split.less',
  ]
})
export class AvatarSplitComponent implements OnInit {

  constructor(
    public avatarSplitService: AvatarSplitService,
    public oneWorker: OneWorker,
  ) {
    this.imageLoaded = false;
    this.centerRect = new Rect();
    this.imageRect = new Rect();
    this.touchStatus = this.TOUCH_END;
  }
  private TOUCH_END = 0;
  private TOUCH_MOVE = 1;
  private TOUCH_RESIZE = 2;

  private MAX_SCALE = 16;

  @ViewChild('avatarCanvas') avatarCanvas: ElementRef;
  @ViewChild('centerBox') centerBox: ElementRef;
  @ViewChild('touchBoard') touchBoard: ElementRef;
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

  private touchStatus: number;
  private originPoints: Array<Point>;

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.getElementSize();
        this.fitImageToCanvas(true);
      });

    this.canvas = this.avatarCanvas.nativeElement;

    this.avatar = this.avatarElement.nativeElement;
    this.touch = this.touchBoard.nativeElement;
    this.getElementSize();
    this.loadImage();
    this.addTouchEvents();
  }

  addTouchEvents() {
    this.touch.addEventListener('mousedown', (e) => {
      this.originPoints = new Array<Point>();
      this.touchStatus = this.TOUCH_MOVE;
      this.originPoints.push(new Point(e.pageX, e.pageY));
    });
    this.touch.addEventListener('mousemove', (e) => {
      const currentPoint: Point = new Point(e.pageX, e.pageY);
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
      const center = new Point(e.pageX, e.pageY);
      this.imageRect.scale(center, scale, this.maxSize, this.centerRect.size);
      this.fitImageToCanvas();
    });
    this.touch.addEventListener('touchstart', (e) => {
      this.originPoints = new Array<Point>();
      if (e.touches.length === 0) {
        return;
      }
      this.originPoints.push(new Point(e.touches[0].pageX, e.touches[0].pageY));
      if (e.touches.length === 1) {
        this.touchStatus = this.TOUCH_MOVE;
      } else {
        this.touchStatus = this.TOUCH_RESIZE;
        this.originPoints.push(new Point(e.touches[1].pageX, e.touches[1].pageY));
      }
    });
    this.touch.addEventListener('touchmove', (e) => {
      const currentPoints: Array<Point> = new Array<Point>();
      if (this.touchStatus === this.TOUCH_END) {
        return;
      }
      e.preventDefault();
      currentPoints.push(new Point(e.touches[0].pageX, e.touches[0].pageY));
      if (this.touchStatus === this.TOUCH_MOVE) {
        this.imageRect.left += currentPoints[0].x - this.originPoints[0].x;
        this.imageRect.top += currentPoints[0].y - this.originPoints[0].y;
        this.originPoints[0].beSameAs(currentPoints[0]);
      } else {
        currentPoints.push(new Point(e.touches[1].pageX, e.touches[1].pageY));
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

  loadImage(debug = false) {
    if (debug) {
      this.image = new Image();
      // this.image.crossOrigin = '';
      this.image.src = 'https://s.6-79.cn/7ytI7l';
      this.imageLoaded = false;
      this.image.onload = () => {
        this.imageLoaded = true;
        this.avatar.style.backgroundImage = `url(${this.image.src})`;
        this.maxSize = new Size(this.image.width, this.image.height);
        this.maxSize.scale(this.MAX_SCALE);
        this.imageRect.width = this.image.width;
        this.imageRect.height = this.image.height;
        this.fitImageToCanvas(true);
      };
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.avatarSplitService.avatar_file);
    reader.onload = (event) => {
      this.image = new Image();
      // this.image.crossOrigin = '';
      this.image.src = event.target.result;
      // this.image.src = 'https://s.6-79.cn/7ytI7l';
      this.imageLoaded = false;
      this.image.onload = () => {
        this.imageLoaded = true;
        this.avatar.style.backgroundImage = `url(${this.image.src})`;
        this.maxSize = new Size(this.image.width, this.image.height);
        this.maxSize.scale(this.MAX_SCALE);
        this.imageRect.width = this.image.width;
        this.imageRect.height = this.image.height;
        this.fitImageToCanvas(true);
      };
    };
  }

  getElementSize() {
    const centerBoxDiv: HTMLDivElement = this.centerBox.nativeElement;
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

  uploadAvatar() {
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
      const file = dataURLtoFile(dataURL, 'avatar-image');
      setTimeout(() => {
        callback();
      }, 1000);
    }, new Toast(AvatarSplitService.ERROR_IS_UPLOADING));
  }
}
