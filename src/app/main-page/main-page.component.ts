import {Component, ViewChild} from '@angular/core';
import {SocialAuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {MatMenuTrigger} from '@angular/material/menu';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  public userInfo: any;

  constructor(private router: Router,
              public socialAuthService: SocialAuthService) {
    socialAuthService.authState.pipe(take(1)).subscribe(result =>  {
      this.userInfo = result;
      console.log(result)
    }, error => console.log(error))
  }



  logout(): void {
    this.socialAuthService.signOut().then(() => this.router.navigate(['login']));
  }

}
