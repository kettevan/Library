import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {MainPageAdminComponent} from './components/main-page-admin/main-page-admin.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {AuthGuardService} from './services/guards/auth-guard.service';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing.module';
import {MatMenuModule} from '@angular/material/menu';
import { UserPageComponent } from './components/user-page/user-page.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import {ToastrModule} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import { CreateAdminDialogComponent } from './components/admin-page/create-admin-dialog/create-admin-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import { SettingEditDialogComponent } from './components/admin-page/setting-edit-dialog/setting-edit-dialog.component';
import { ConfirmDeleteDialogComponent } from './components/shared/confirm-delete-dialog/confirm-delete-dialog.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MainPageUserComponent } from './components/main-page-user/main-page-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainPageAdminComponent,
    FooterComponent,
    HeaderComponent,
    UserPageComponent,
    AdminPageComponent,
    CreateAdminDialogComponent,
    SettingEditDialogComponent,
    ConfirmDeleteDialogComponent,
    MainPageUserComponent
  ],
  imports: [
    ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        timeOut: 2000
      }
    ),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    SocialLoginModule,
    ReactiveFormsModule,
    NgbModule,
    MatMenuModule,
    MatTabsModule,
    HttpClientModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatGridListModule,
    MatListModule,
    MatSidenavModule,
    MatExpansionModule,
    ScrollingModule
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: true,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('148517665605-jspahbqleats6lvlag9kasc2c11b5g7o.apps.googleusercontent.com')
        }
      ]
    }
  },
    AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
