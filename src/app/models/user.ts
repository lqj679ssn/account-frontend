export class User {
  nickname: string;
  description: string;
  avatar: string;
  qitian: string;
  allow_qitian_modify: boolean;
  user_str_id: string;

  constructor(_: {nickname, description, avatar, qitian, allow_qitian_modify, user_str_id}) {
    this.nickname = _.nickname;
    this.description = _.description;
    this.avatar = _.avatar;
    this.qitian = _.qitian;
    this.allow_qitian_modify = _.allow_qitian_modify;
    this.user_str_id = _.user_str_id;
  }
}
