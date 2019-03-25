export class Link {
  link: string;

  constructor(link?: string) {
    this.link = link;
  }

  get url() {
    if (!this.link) {
      return null;
    }
    return `url('${this.link}')`;
  }
}
