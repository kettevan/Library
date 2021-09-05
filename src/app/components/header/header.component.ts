import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import jwt_decode from "jwt-decode"
import {LoginComponent} from '../login/login.component';
import {LoginService} from '../../services/login-services/login.service';
import {Observable, of} from 'rxjs';
import {SharedService} from '../../services/shared/shared.service';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {SocialAuthService} from 'angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  public user$: Observable<boolean>;
  public admin$: Observable<boolean>;

  constructor(private sharedService: SharedService, private router: Router, public socialAuthServive: SocialAuthService) {
    this.sharedService.user.subscribe(result => {
      console.log(result)
      if (result.toUpperCase() === 'ADMIN' || result.toUpperCase() === 'SUPER_ADMIN') {
        this.admin$ = of(true);
        this.user$ = of(false);
      } else if (result.toUpperCase() === 'USER') {
        this.user$ = of(true);
        this.admin$ = of(false);
      } else {
        this.user$ = of(false);
        this.admin$ = of(false);
      }
    })
  };

  isAdminOrUser(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }


  logout(): void {
    this.user$.subscribe(isUser => {
      if (isUser) {
        localStorage.clear();
        this.user$ = of(false);
        this.admin$ = of(false);
        this.socialAuthServive.signOut().then(() => this.router.navigate(['/login']));
      }
    })
    this.admin$.subscribe(isAdmin => {
      if (isAdmin) {
        localStorage.clear();
        this.user$ = of(false);
        this.admin$ = of(false);
        this.router.navigate(['/login'])
      }
    })
  }

  ngOnInit(): void {
    this.getTokenInfo();
  }

  getTokenInfo() {
    var token = localStorage.getItem('token');
    if (token != null) {
      var decoded = jwt_decode(token);
      if (decoded['Role'].toUpperCase() === 'USER') {
        this.user$ = of(true);
        this.admin$ = of(false);
      } else if (decoded['Role'].toUpperCase() === 'ADMIN' || decoded['Role'].toUpperCase() === 'SUPER_ADMIN') {
        this.user$ = of(false);
        this.admin$ = of(true);
      }
    } else {
      this.user$ = of(false);
      this.admin$ = of(false);
    }
  }

  isActive(comp: string): boolean {
    if (this.router.url === comp) {
      return true;
    }
    return false;
  }
}
