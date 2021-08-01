import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {SocialAuthService} from 'angularx-social-login';
import {SharedService} from '../../services/shared/shared.service';

@Component({
  selector: 'app-main-page-user',
  templateUrl: './main-page-user.component.html',
  styleUrls: ['./main-page-user.component.scss']
})
export class MainPageUserComponent implements OnInit {
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

  ngOnInit(): void {
  }

}
