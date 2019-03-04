export class UserHabit {
  version: string;
  private data: any;

  constructor(version: string) {
    this.version = version;
    this.data = {};
  }

  setData(userHabit: UserHabit) {
    this.data = userHabit.data;
  }
}
