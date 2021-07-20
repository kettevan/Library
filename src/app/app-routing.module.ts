import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainPageComponent} from './main-page/main-page.component';
import {AuthGuardService} from './services/guards/auth-guard.service';
import {UserPageComponent} from './user-page/user-page.component';
import {AdminGuardService} from './services/guards/admin-guard.service';
import {AdminPageComponent} from './admin-page/admin-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'mainpage', component: MainPageComponent, canActivate: [AuthGuardService] },
  { path: 'userpage', component: UserPageComponent, canActivate: [AuthGuardService] },
  { path: 'adminpage', component: AdminPageComponent, canActivate: [AdminGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
