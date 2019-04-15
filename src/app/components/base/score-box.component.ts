import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChooseItem} from '../../models/choose-item';
import {App} from '../../models/app';
import {ApiService} from '../../services/api.service';
import {ToastService} from '../../services/toast.service';
import {Toast} from '../../models/toast';
import {OneWorker} from '../../services/one-worker.service';

@Component({
  selector: 'app-score-box',
  templateUrl: './score-box.component.html',
  styleUrls: [
    '../../../assets/styles/base/score-box.less',
    '../../../assets/styles/icomoon.css',
  ]
})
export class ScoreBoxComponent {
  @Input() app: App;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter<Array<ChooseItem>>();

  showScoreBox: boolean;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private oneWorker: OneWorker,
  ) {}

  getArrayInstance(number) {
    return Array.from(Array(number).keys());
  }

  cancel() {
    this.hide();
    this.onCancel.emit();
  }

  show() {
    this.showScoreBox = true;
  }

  hide() {
    this.showScoreBox = false;
  }

  getMyScoreClass(score) {
    return this.app.relation.mark > score ? 'icon-star-s' : 'icon-star-l';
  }

  get myScoreText() {
    return this.app.relation.mark > 0 ? `${this.app.relation.mark}星` : '轻触右侧评分';
  }

  updateScore(score) {
    if (!this.app.relation.bind) {
      this.toastService.show(new Toast('请先体验应用后评分'));
      return;
    }
    this.oneWorker.do('score-update', (callback) => {
      this.api.updateScore(this.app.relation.user_app_id, {mark: score})
        .then(resp => {
          this.toastService.show(new Toast('您的评分已更新'));
          this.app.mark = resp;
          this.app.updateValue();
          this.app.relation.mark = score;
          // this.hide();
          callback();
        }).catch(callback);
    }, new Toast('正在更新评分'));
  }
}
