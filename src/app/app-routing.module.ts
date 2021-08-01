import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {MainPageAdminComponent} from './components/main-page-admin/main-page-admin.component';
import {AuthGuardService} from './services/guards/auth-guard.service';
import {UserPageComponent} from './components/user-page/user-page.component';
import {AdminGuardService} from './services/guards/admin-guard.service';
import {AdminPageComponent} from './components/admin-page/admin-page.component';
import {CommonGuardService} from './services/guards/common-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'adminmainpage', component: MainPageAdminComponent, canActivate: [AdminGuardService] },
  { path: 'usermainoage', component: UserPageComponent, canActivate: [AuthGuardService] },
  { path: 'userpage', component: UserPageComponent, canActivate: [AuthGuardService] },
  { path: 'adminpage', component: AdminPageComponent, canActivate: [AdminGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
