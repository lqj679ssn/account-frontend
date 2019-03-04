import {Injectable} from '@angular/core';
import {LocalService} from './local.service';
import {UserHabit} from '../models/user-habit';

@Injectable()
export class UserHabitService {
  habit: UserHabit;
  currentVersion: string;
  userId: string;
  loaded: boolean;

  get userHabitKey() {
    return `user-habit-${this.userId}`;
  }

  constructor(
    private local: LocalService,
  ) {
    this.currentVersion = '1.0.0';
    this.habit = new UserHabit(this.currentVersion);
    this.loaded = false;
    this.autoSave();
  }

  changeUser(userId: string) {
    this.userId = userId;
    this.loaded = false;
    this.load();
  }

  load() {
    const rawPreviousHabit = this.local.load(this.userHabitKey);
    if (rawPreviousHabit) {
      this.habit.setData(JSON.parse(rawPreviousHabit));
    }
    this.loaded = true;
  }

  save() {
    this.local.save(this.userHabitKey, JSON.stringify(this.habit));
  }

  autoSave() {
    setInterval(() => {
      if (this.userId && this.loaded) {
        this.save();
      }
    }, 1000);
  }

  remove() {
    this.loaded = false;
    this.local.remove(this.userHabitKey);
    this.load();
  }
}
