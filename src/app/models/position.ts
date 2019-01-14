export class Point {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    this.setParam(x, y);
  }

  setParam(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  beSameAs(anotherPoint: Point) {
    this.x = anotherPoint.x;
    this.y = anotherPoint.y;
  }

  distTo(anotherPoint: Point) {
    return Math.sqrt(Math.pow(this.x - anotherPoint.x, 2) + Math.pow(this.y - anotherPoint.y, 2));
  }

  middleWith(anotherPoint: Point) {
    return new Point((this.x + anotherPoint.x) / 2, (this.y + anotherPoint.y) / 2);
  }

  toString() {
    return `x: ${this.x}, y: ${this.y}`;
  }
}

export class Size {
  public w: number;
  public h: number;

  constructor(w?: number, h?: number) {
    this.setParam(w, h);
  }

  setParam(w?: number, h?: number) {
    this.w = w || 0;
    this.h = h || 0;
  }

  scale(scale: number, maxSize: Size = null, minSize: Size = null): Boolean {
    if (this.w * scale < 1) {
      return false;
    }
    if (this.h * scale < 1) {
      return false;
    }
    if (maxSize) {
      if (this.w * scale > maxSize.w) {
        return false;
      }
      if (this.h * scale > maxSize.h) {
        return false;
      }
    }
    if (minSize) {
      if (this.w * scale < minSize.w) {
        return false;
      }
      if (this.h * scale < minSize.h) {
        return false;
      }
    }
    this.w *= scale;
    this.h *= scale;
    return true;
  }
}

export class Rect {
  private _topLeftPoint: Point;
  private _size: Size;

  constructor() {
    this._topLeftPoint = new Point();
    this._size = new Size();
  }

  setParam(top: number, left: number, width: number, height: number) {
    this._topLeftPoint.setParam(left, top);
    this._size.setParam(width, height);
  }

  setParamWithCenter(center: Point, size: Size) {
    this._topLeftPoint.setParam(center.x - size.w / 2, center.y - size.h / 2);
    this._size.setParam(size.w, size.h);
  }

  get center() {
    return new Point(this.left + this.width / 2, this.top + this.height / 2);
  }

  moveFill(rect: Rect) {
    let requireResize: Boolean = false;
    if (rect.width <= this.width) {
      if (rect.left < this.left) {
        this.left = rect.left;
      }
      if (rect.right > this.right) {
        this.left = rect.right - this.width;
      }
    } else {
      this.left = rect.center.x - rect.width / 2;
      requireResize = true;
    }
    if (rect.height <= this.height) {
      if (rect.top < this.top) {
        this.top = rect.top;
      }
      if (rect.bottom > this.bottom) {
        this.top = rect.bottom - this.height;
      }
    } else {
      this.top = rect.center.y - rect.height / 2;
      requireResize = true;
    }
    if (requireResize) {
      this.resizeFill(rect);
    }
  }

  resizeFill(rect: Rect) {
    const center = this.center;
    const topScale = (center.y - rect.top) / (this.height / 2);
    const bottomScale = (rect.bottom - center.y) / (this.height / 2);
    const leftScale = (center.x - rect.left) / (this.width / 2);
    const rightScale = (rect.right - center.x) / (this.width / 2);
    const finalScale = Math.max(topScale, bottomScale, leftScale, rightScale, 1);
    const size = new Size(this.width * finalScale, this.height * finalScale);
    this.setParamWithCenter(center, size);
  }

  // 以圆形中心为中心，正好填充
  totalFit(rect: Rect) {
    const center = rect.center;
    const widthScale = rect.width / this.width;
    const heightScale = rect.height / this.height;
    const finalScale = Math.max(widthScale, heightScale);
    const size = new Size(this.width * finalScale, this.height * finalScale);
    this.setParamWithCenter(center, size);
  }

  scale(center: Point, scale: number, maxSize: Size = null, minSize: Size = null) {
    const isScaled = this._size.scale(scale, maxSize, minSize);
    if (isScaled) {
      this._topLeftPoint.setParam(
        center.x - (center.x - this.left) * scale,
        center.y - (center.y - this.top) * scale
      );
    }
  }

  get width() {
    return this._size.w;
  }
  set width(width: number) {
    this._size.w = width;
  }
  get height() {
    return this._size.h;
  }
  set height(height: number) {
    this._size.h = height;
  }

  get left() {
    return this._topLeftPoint.x;
  }
  set left(left: number) {
    this._topLeftPoint.x = left;
  }
  get right() {
    return this.left + this.width;
  }
  get top() {
    return this._topLeftPoint.y;
  }
  set top(top: number) {
    this._topLeftPoint.y = top;
  }
  get bottom() {
    return this.top + this.height;
  }

  toString() {
    return `top: ${this.top}, left: ${this.left}, w: ${this.width}, h: ${this.height}`;
  }

  get size() {
    return this._size;
  }
}
