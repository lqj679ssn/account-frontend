import {Component, OnInit} from '@angular/core';
import {MenuFootBtnService} from '../../services/menu-foot-btn.service';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: [
    '../../../assets/styles/menu/menu.less',
    '../../../assets/styles/mywebicon.css',
  ]
})
export class HomePageComponent implements OnInit {
  constructor(
    private footBtnService: MenuFootBtnService,
  ) {}

  ngOnInit(): void {
    this.footBtnService.setActive(this.footBtnService.footBtnHomePage);
  }
}
