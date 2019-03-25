import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { ProgressHttpModule } from 'angular-progress-http';

import { AppComponent } from './app.component';
import { HomePageComponent } from './components/menu/home-page.component';
import { SayingComponent } from './components/base/saying.component';
import { ImageSplitComponent } from './components/base/image-split.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserSettingComponent } from './components/menu/user-setting.component';
import { UnLoginComponent } from './components/user/un-login.component';
import { ChooseBoxComponent } from './components/base/choose-box.component';
import { CaptchaBoxComponent } from './components/base/captcha-box.component';
import { LoadingBoxComponent } from './components/base/loading-box.component';
import { OauthComponent } from './components/app/oauth.component';
import { DisplayComponent } from './components/app/display.component';
import { ApplyComponent } from './components/app/apply.component';
import { UpdateComponent } from './components/app/update.component';
import { ToastComponent } from './components/base/toast.component';

import { ClockService } from './services/clock.service';
import { ImageSplitService } from './services/image-split.service';
import { ToastService } from './services/toast.service';
import { OneWorker } from './services/one-worker.service';
import { RequestService } from './services/request.service';
import { MenuFootBtnService } from './services/menu-foot-btn.service';
import { ReCAPTCHAService } from './services/recaptcha.service';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { UserHabitService } from './services/user-habit.service';
import { LocalService } from './services/local.service';
import { JumpService } from './services/jump.service';
import { markedOptionsFactory } from './services/common.service';
import { AppDepotService } from './services/app-depot.service';
import {ScoreBoxComponent} from './components/base/score-box.component';

@NgModule({
  declarations: [
    MenuComponent,
    AppComponent,
    HomePageComponent,
    UserSettingComponent,
    SayingComponent,
    ImageSplitComponent,
    ToastComponent,
    UnLoginComponent,
    ChooseBoxComponent,
    CaptchaBoxComponent,
    LoadingBoxComponent,
    OauthComponent,
    DisplayComponent,
    ApplyComponent,
    UpdateComponent,
    ScoreBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MarkdownModule.forRoot({
      provide: MarkedOptions,
      useFactory: markedOptionsFactory,
      useValue: {
        tables: true,
      }
    }),
    // ProgressHttpModule,
  ],
  providers: [
    MenuFootBtnService,
    ClockService,
    RequestService,
    ImageSplitService,
    ToastService,
    OneWorker,
    ReCAPTCHAService,
    ApiService,
    UserService,
    UserHabitService,
    LocalService,
    JumpService,
    AppDepotService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
