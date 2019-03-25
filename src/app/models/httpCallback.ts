class CallbackFunction {
  private readonly _function: any;

  constructor(f) {
    this._function = f;
  }

  static handler(...any) {}

  get isFunction() {
    return typeof this._function === 'function';
  }

  get run() {
    if (this.isFunction) {
      return this._function;
    } else {
      return CallbackFunction.handler();
    }
  }
}

export class HttpCallback {
  uploadProgress: CallbackFunction;
  downloadProgress: CallbackFunction;
  responseCallback: CallbackFunction;
  failResponseCallback: CallbackFunction;

  constructor(_: {uploadProgress?, downloadProgress?, responseCallback?, failResponseCallback?}) {
    this.uploadProgress = new CallbackFunction(_.uploadProgress);
    this.downloadProgress = new CallbackFunction(_.downloadProgress);
    this.responseCallback = new CallbackFunction(_.responseCallback);
    this.failResponseCallback = new CallbackFunction(_.failResponseCallback);
  }
}
