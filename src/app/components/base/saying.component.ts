import {Component, Input, OnInit} from '@angular/core';
import {RequestService} from '../../services/request.service';
import {OneWorker} from '../../services/one-worker.service';

@Component({
  selector: 'app-saying',
  templateUrl: './saying.component.html',
  styleUrls: [
    '../../../assets/styles/base/saying.less',
  ]
})
export class SayingComponent implements OnInit {
  @Input() identifier: string;
  sayingText: string;

  constructor(
    private request: RequestService,
    private oneWorker: OneWorker,
  ) {
    this.sayingText = '';
  }

  ngOnInit(): void {
    this.getSaying();
  }

  getSaying() {
    this.oneWorker.do('get-saying' + this.identifier, (callback) => {
      this.request.get('https://saying.6-79.cn/api/sentence', {max_length: 24, consider_author: 1})
        .then((body) => {
          const author = body.author || '佚名';
          this.sayingText = `${author} | ${body.sentence}`;
          callback();
        })
        .catch(() => {
          callback();
        });
    });
  }
}
