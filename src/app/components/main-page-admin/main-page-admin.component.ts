import {Component, OnDestroy} from '@angular/core';
import {SocialAuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {SharedService} from '../../services/shared/shared.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page-admin.component.html',
  styleUrls: ['./main-page-admin.component.scss']
})
export class MainPageAdminComponent implements OnDestroy{
  public userInfo: any;
  private subs = [];

  constructor(private router: Router,
              public socialAuthService: SocialAuthService, private sharedService: SharedService) {
    const token = localStorage.getItem('token');
    if (token != null && jwt_decode(token)['Role'].toUpperCase() === 'USER') {
      const socialAuthSubs = socialAuthService.authState.pipe(take(1))
      socialAuthSubs.subscribe(result => {
        if (result) {
          this.userInfo = result;
          localStorage.setItem('user', JSON.stringify(result));
        }
      }, error => console.log(error));
      this.subs.push(socialAuthSubs);
    }
  }



  logout(): void {
    this.socialAuthService.signOut().then(() =>  {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.sharedService.editUser('');
      this.router.navigate(['login']);
    }
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(subscription => subscription.unsubscribe);
  }

}
