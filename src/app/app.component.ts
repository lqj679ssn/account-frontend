import { Component } from '@angular/core';
import { ClockService } from './services/clock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    '../assets/styles/app.less',
  ]
})
export class AppComponent {
  constructor() {
    ClockService.StartClock();
  }
}
