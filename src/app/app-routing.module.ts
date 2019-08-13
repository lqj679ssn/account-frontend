import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './components/menu/home-page.component';
import {ImageSplitComponent} from './components/base/image-split.component';
import {MenuComponent} from './components/menu/menu.component';
import {UserSettingComponent} from './components/menu/user-setting.component';
import {UnLoginComponent} from './components/user/un-login.component';
import {OauthComponent} from './components/app/oauth.component';
import {ApplyComponent} from './components/app/apply.component';
import {ManageComponent} from './components/app/manage.component';
import {InitProfileComponent} from './components/user/init-profile.component';
import {AppCenterComponent} from './components/menu/app-center.component';

const routes: Routes = [
  {
    path: 'user/login',
    component: UnLoginComponent,
    data: {mode: UnLoginComponent.MODE_LOGIN_PHONE_PWD},
  },
  {
    path: 'user/register',
    component: UnLoginComponent,
    data: {mode: UnLoginComponent.MODE_REGISTER},
  },
  {
    path: 'user/find-pwd',
    component: UnLoginComponent,
    data: {mode: UnLoginComponent.MODE_FIND_PWD},
  },
  {
    path: 'user/init',
    component: InitProfileComponent,
  },
  {
    path: 'menu',
    component: MenuComponent,
    children: [
      { path: '', redirectTo: 'home-page', pathMatch: 'full'},
      { path: 'home-page', component: HomePageComponent, data: {oauth: false} },
      { path: 'app-center', component: AppCenterComponent },
      { path: 'user-setting', component: UserSettingComponent },
      { path: 'home-page/oauth', component: HomePageComponent, data: {oauth: true} },
      { path: 'app-center/oauth', component: AppCenterComponent, data: {oauth: true} },
    ]
  },
  {
    path: 'base/avatar/cut',
    component: ImageSplitComponent
  },
  {
    path: 'oauth',
    component: OauthComponent,
  },
  {
    path: 'app/apply',
    component: ApplyComponent,
  },
  {
    path: 'app/manage',
    component: ManageComponent,
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
