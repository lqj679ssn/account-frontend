import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './components/menu/home-page.component';
import { SayingComponent } from './components/base/saying.component';
import { ClockService } from './services/clock.service';
import { AvatarSplitComponent } from './components/base/avatar-split.component';
import { AvatarSplitService } from './services/avatar-split.service';
import { ToastComponent } from './components/base/toast.component';
import { ToastService } from './services/toast.service';
import {OneWorker} from './services/one-worker.service';
import {RequestService} from './services/request.service';
import {HttpClientModule} from '@angular/common/http';
import {MenuComponent} from './components/menu/menu.component';
import {MenuFootBtnService} from './services/menu-foot-btn.service';
import {UserSettingComponent} from './components/menu/user-setting.component';
import {UnLoginComponent} from './components/user/un-login.component';
import {FormsModule} from '@angular/forms';
import {ReCAPTCHAService} from './services/recaptcha.service';
import {ChooseBoxComponent} from './components/base/choose-box.component';
import {ApiService} from './services/api.service';
import {CaptchaBoxComponent} from './components/base/captcha-box.component';
import {LoadingBoxComponent} from './components/base/loading-box.component';
import {UserService} from './services/user.service';
import {UserHabitService} from './services/user-habit.service';
import {LocalService} from './services/local.service';
import {JumpService} from './services/jump.service';

@NgModule({
  declarations: [
    MenuComponent,
    AppComponent,
    HomePageComponent,
    UserSettingComponent,
    SayingComponent,
    AvatarSplitComponent,
    ToastComponent,
    UnLoginComponent,
    ChooseBoxComponent,
    CaptchaBoxComponent,
    LoadingBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    // ProgressHttpModule,
  ],
  providers: [
    MenuFootBtnService,
    ClockService,
    RequestService,
    AvatarSplitService,
    ToastService,
    OneWorker,
    ReCAPTCHAService,
    ApiService,
    UserService,
    UserHabitService,
    LocalService,
    JumpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
