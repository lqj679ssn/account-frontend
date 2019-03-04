import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './components/menu/home-page.component';
import {AvatarSplitComponent} from './components/base/avatar-split.component';
import {MenuComponent} from './components/menu/menu.component';
import {UserSettingComponent} from './components/menu/user-setting.component';
import {UnLoginComponent} from './components/user/un-login.component';

const routes: Routes = [
  {
    path: 'user/login',
    component: UnLoginComponent,
    data: {mode: UnLoginComponent.MODE_LOGIN_PHONE_CODE},
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
    path: 'menu',
    component: MenuComponent,
    children: [
      { path: '', redirectTo: 'home-page', pathMatch: 'full'},
      { path: 'home-page', component: HomePageComponent },
      { path: 'user-setting', component: UserSettingComponent },
    ]
  },
  {
    path: 'base/avatar/cut',
    component: AvatarSplitComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
