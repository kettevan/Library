import {Component, OnDestroy, ViewChild} from '@angular/core';
import {SocialAuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {MatMenuTrigger} from '@angular/material/menu';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnDestroy{
  public userInfo: any;
  private subs = [];

  constructor(private router: Router,
              public socialAuthService: SocialAuthService) {
    const socialAuthSubs = socialAuthService.authState.pipe(take(1))
    socialAuthSubs.subscribe(result =>  {
      if (result) {
        this.userInfo = result;
        localStorage.setItem('user', JSON.stringify(result));
      }
    }, error => console.log(error));
    this.subs.push(socialAuthSubs);
  }



  logout(): void {
    this.socialAuthService.signOut().then(() =>  {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(subscription => subscription.unsubscribe);
  }

}
