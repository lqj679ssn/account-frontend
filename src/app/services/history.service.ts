import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {OneWorker} from './one-worker.service';
import {Subscription} from 'rxjs';
import {JumpService} from './jump.service';

@Injectable()
export class HistoryService {
  link: Array<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jump: JumpService,
  ) {
    this.link = [];
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.link.push({
          path: location.pathname,
          params: this.activatedRoute.snapshot.queryParams,
        });
      }
    });
  }

  get empty() {
    return this.link.length < 2;
  }

  go(fail = null) {
    if (!this.empty) {
      const last: any = this.link[this.link.length - 2];
      this.link.pop();
      this.link.pop();
      this.jump.handler([last.path], last.params);
    } else if (fail) {
      fail();
    }
  }
}
