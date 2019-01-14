import {Injectable} from '@angular/core';

@Injectable()
export class ClockService {
  public static c_timestamp: number; // current timestamp
  public static c_date: Date;
  private static time_interval = null;
  private static refreshTime() {
    ClockService.c_date = new Date();
    // utc_ts_offset = current_time.getTimezoneOffset() * 60;
    ClockService.c_timestamp = ClockService.c_date.getTime() / 1000;
  }
  public static startClock() {
    clearInterval(ClockService.time_interval);
    ClockService.time_interval = setInterval(ClockService.refreshTime, 60000);
    ClockService.refreshTime();
  }

  private static getZeroPitchedNumber(num: number) {
    return ((num > 10) ? '' : '0') + num;
  }

  public getFormattedDate() {
    return [
      ClockService.c_date.getFullYear(),
      ClockService.getZeroPitchedNumber(ClockService.c_date.getMonth() + 1),
      ClockService.getZeroPitchedNumber(ClockService.c_date.getDate())
    ].join('-');
  }

  public getConstellation(birthday) {
    const d = new Date(birthday);
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const constellations = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
    const magic = [21, 19, 21, 20, 21, 22, 23, 23, 23, 23, 22, 22];
    return constellations.substr(month * 2 - (date < magic[month - 1] ? 2 : 0), 2) + '座';
  }
}
