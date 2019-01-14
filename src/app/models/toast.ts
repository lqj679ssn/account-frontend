export class Toast {
  static TYPE_NORMAL = 0;
  static TIME_AUTO = 0;
  static TIME_ALWAYS = -1;
  static TIME_PER_LETTER = 400;

  text: string;
  type: number;
  time: number;

  constructor(text, type = null, time = null) {
    this.text = text || '';
    this.type = type || Toast.TYPE_NORMAL;
    this.time = time || Toast.TIME_AUTO;
    if (this.time < 0) {
      this.time = Toast.TIME_ALWAYS;
    } else if (this.time === Toast.TIME_AUTO) {
      this.time = this.text.length * Toast.TIME_PER_LETTER;
    }
  }
}
