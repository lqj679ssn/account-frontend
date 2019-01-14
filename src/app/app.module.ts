import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserCenterComponent } from './components/user/user-center.component';
import { SayingComponent } from './components/base/saying.component';
import { ClockService } from './services/clock.service';
import { AvatarSplitComponent } from './components/base/avatar-split.component';
import { AvatarSplitService } from './services/avatar-split.service';
import { ToastComponent } from './components/base/toast.component';
import { ToastService } from './services/toast.service';
import {OneWorker} from './services/one-worker.service';
import {AnimateButtonComponent} from './components/base/animate-button.component';
import {RequestService} from './services/request.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    UserCenterComponent,
    SayingComponent,
    AvatarSplitComponent,
    ToastComponent,
    AnimateButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // ProgressHttpModule,
  ],
  providers: [
    ClockService,
    RequestService,
    AvatarSplitService,
    ToastService,
    OneWorker,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
