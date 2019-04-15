export class IDCard {
  real_name: string;
  male: boolean;
  idcard: string;
  birthday: string;
  valid_start: string;
  valid_end: string;
  token: string;
  expireTime: number;

  constructor(_: {name?, male?, idcard?, birthday?, valid_start?, valid_end?, token?, ctime?, expire?}) {
    this.real_name = _.name;
    this.male = _.male;
    this.idcard = _.idcard;
    this.birthday = _.birthday;
    this.valid_start = _.valid_start;
    this.valid_end = _.valid_end;
    this.token = _.token;
    this.expireTime = _.ctime + _.expire;
  }

  get sex() {
     return this.male ? '男' : '女';
  }

  set sex(value) {
    this.male = value === '男';
  }
}
