import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {LocalService} from './local.service';
import {LoadCallback} from '../models/load-callback';
import {RequestService} from './request.service';
import {UserHabitService} from './user-habit.service';

@Injectable()
export class UserService {
  public tokenKey: string;
  private _user: User;
  private _backUser: User;
  private _token: string;

  public tokenLC: LoadCallback;
  public userLC: LoadCallback;

  constructor(
    private local: LocalService,
    private userHabitService: UserHabitService,
  ) {
    this._user = new User({});
    this.tokenKey = 'user-token';
    this.tokenLC = new LoadCallback();
    this.userLC = new LoadCallback();
    this.loadToken();
  }

  loadToken() {
    this._token = this.local.load(this.tokenKey);
    RequestService.token = this._token;
    this.tokenLC.load();
  }

  saveToken() {
    this.local.save(this.tokenKey, this._token);
  }

  userBackUp() {
    this._backUser = new User({user_str_id: this.user.user_str_id});
    this._backUser.update(this._user);
  }

  restoreBackUp() {
    this.user.update(this._backUser);
  }

  get token() {
    return this._token;
  }
  set token(token: string) {
    this._token = token;
    RequestService.token = this._token;
    this.saveToken();
  }

  get user() {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
    this.userBackUp();
    this.userLC.load();
    this.userHabitService.changeUser(this._user.user_str_id);
  }

  get isLogin() {
    return !!this.user.user_str_id;
  }
}
