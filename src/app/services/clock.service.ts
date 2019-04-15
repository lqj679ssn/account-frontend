import {Injectable} from '@angular/core';

@Injectable()
export class ClockService {
  public static cTimestamp: number; // current timestamp
  public static cDate: Date;
  private static time_interval = null;
  private static refreshTime() {
    ClockService.cDate = new Date();
    // utc_ts_offset = current_time.getTimezoneOffset() * 60;
    ClockService.cTimestamp = ClockService.cDate.getTime() / 1000;
  }
  public static startClock() {
    clearInterval(ClockService.time_interval);
    ClockService.time_interval = setInterval(ClockService.refreshTime, 1000);
    ClockService.refreshTime();
  }

  private static getZeroPitchedNumber(num: number) {
    return ((num > 10) ? '' : '0') + num;
  }

  public getFormattedDate() {
    return [
      ClockService.cDate.getFullYear(),
      ClockService.getZeroPitchedNumber(ClockService.cDate.getMonth() + 1),
      ClockService.getZeroPitchedNumber(ClockService.cDate.getDate())
    ].join('-');
  }

  public getConstellation(birthday) {
    if (!birthday) {
      return '暂未选择生日';
    }
    const d = new Date(birthday);
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const constellations = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
    const magic = [21, 19, 21, 20, 21, 22, 23, 23, 23, 23, 22, 22];
    return constellations.substr(month * 2 - (date < magic[month - 1] ? 2 : 0), 2) + '座';
  }

  public getReadableBirthday(birthday) {
    if (!birthday) {
      return '暂未选择生日';
    } else {
      return `${birthday} ${this.getConstellation(birthday)}`;
    }
  }
}
