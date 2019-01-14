import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserCenterComponent} from './components/user/user-center.component';
import {AvatarSplitComponent} from './components/base/avatar-split.component';

const routes: Routes = [
  { path: 'user/center', component: UserCenterComponent},
  { path: 'base/avatar/cut', component: AvatarSplitComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
