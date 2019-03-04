export class PreloadImage {
  src: string;
  loaded: boolean;
  image: HTMLImageElement;
  constructor(src: string) {
    this.src = src;
    this.loaded = false;
    this.image = new Image();
  }

  load(onload) {
    this.image.src = this.src;
    this.image.onload = () => {
      this.loaded = true;
      if (onload) {
        onload();
      }
    };
  }
}
