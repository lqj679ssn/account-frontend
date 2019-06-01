import {Link} from './link';

export class User {
  static VERIFY_STATUS_UNVERIFIED = 0;
  static VERIFY_STATUS_UNDER_AUTO = 1;
  static VERIFY_STATUS_UNDER_MANUAL = 2;
  static VERIFY_STATUS_DONE = 3;

  static VERIFY_CHINA = 0;
  static VERIFY_ABROAD = 1;

  nickname: string;
  description: string;
  birthday: string;
  avatar: Link;
  qitian: string;
  allow_qitian_modify: boolean;
  user_str_id: string;
  verify_status: number;
  verify_type: number;
  is_dev: boolean;

  constructor(_: {nickname?, description?, avatar?, qitian?, allow_qitian_modify?, user_str_id?, birthday?, verify_status?, verify_type?, is_dev?}) {
    this.user_str_id = _.user_str_id;
    this.update(_);
  }

  update(_: {nickname?, description?, avatar?, qitian?, allow_qitian_modify?, birthday?, verify_status?, verify_type?, is_dev?}) {
    this.nickname = _.nickname;
    this.description = _.description;
    if (_.avatar instanceof Link) {
      this.avatar = new Link(_.avatar.link);
    } else {
      this.avatar = new Link(_.avatar);
    }
    this.qitian = _.qitian;
    this.allow_qitian_modify = _.allow_qitian_modify;
    this.birthday = _.birthday;
    this.verify_status = _.verify_status;
    this.verify_type = _.verify_type;
    this.is_dev = _.is_dev;
  }

  get isVerified() {
    return this.verify_status === User.VERIFY_STATUS_DONE;
  }

  get isUnverified() {
    return this.verify_status === User.VERIFY_STATUS_UNVERIFIED;
  }

  get isAutoVerifying() {
    return this.verify_status === User.VERIFY_STATUS_UNDER_AUTO;
  }

  get isManualVerifying() {
    return this.verify_status === User.VERIFY_STATUS_UNDER_MANUAL;
  }
}
