import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ToastService} from '../../services/toast.service';
import {Toast} from '../../models/toast';
import {ChooseItem} from '../../models/choose-item';

@Component({
  selector: 'app-choose-box',
  templateUrl: './choose-box.component.html',
  styleUrls: [
    '../../../assets/styles/base/choose-box.less',
    '../../../assets/styles/icomoon.css',
  ]
})
export class ChooseBoxComponent {
  @Input() boxTitle: string;
  @Input() chooseList: Array<ChooseItem>;
  @Input() showSearchBox: boolean;
  @Input() maxChosenNum: number;
  @Input() minChosenNum: number;
  @Input() fastMode: boolean;
  @Input() keyword: string;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter<Array<ChooseItem>>();

  showChooseBox: boolean;

  constructor(
    private toastService: ToastService,
  ) {
    this.hide();
  }

  get searchList() {
    if (!this.keyword) {
      return this.chooseList;
    }
    const _ = [];
    for (const chooseItem of this.chooseList) {
      if (chooseItem.key.indexOf(this.keyword) >= 0 || chooseItem.value.indexOf(this.keyword) >= 0) {
        _.push(chooseItem);
      }
    }

    return _;
  }

  get chosenNum() {
    let num = 0;
    if (this.chooseList) {
      for (const chooseItem of this.chooseList) {
        num += Number(chooseItem.selected);
      }
    }
    return num;
  }

  get chosenItems() {
    const chosenList = [];
    for (const chooseItem of this.chooseList) {
      if (chooseItem.selected) {
        chosenList.push(chooseItem);
      }
    }
    return chosenList;
  }

  triggerChoose(id: string) {
    if (this.maxChosenNum === 1) {
      let chosenItem: ChooseItem;
      for (const chooseItem of this.chooseList) {
        if (id === chooseItem.id) {
          chooseItem.selected = !chooseItem.selected;
          chosenItem = chooseItem;
        } else {
          chooseItem.selected = false;
        }
      }
      if (this.fastMode && chosenItem && chosenItem.selected) {
        this.submit();
      }
      return;
    }

    for (const chooseItem of this.chooseList) {
      if (id === chooseItem.id) {
        if (this.maxChosenNum && this.chosenNum >= this.maxChosenNum && !chooseItem.selected) {
          this.toastService.show(new Toast(`你最多只能选择${this.maxChosenNum}项`));
        } else {
          chooseItem.selected = !chooseItem.selected;
        }
        break;
      }
    }
    if (this.fastMode && this.maxChosenNum && this.minChosenNum &&
      this.maxChosenNum === this.minChosenNum && this.chosenNum === this.maxChosenNum) {
      this.submit();
    }
  }

  cancel() {
    // console.log('cancel', !this.searchList);
    this.hide();
    this.onCancel.emit();
  }

  submit() {
    if (this.minChosenNum && this.chosenNum < this.minChosenNum) {
      this.toastService.show(new Toast(`你最少需要选择${this.minChosenNum}项`));
    }
    this.hide();
    // console.log('submit');
    this.onSubmit.emit(this.chosenItems);
  }

  show() {
    this.showChooseBox = true;
  }

  hide() {
    this.showChooseBox = false;
  }
}
