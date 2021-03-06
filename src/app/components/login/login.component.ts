import {Component, EventEmitter, Injectable, OnDestroy, OnInit, Output} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../services/login-services/login.service';
import { ToastrService } from 'ngx-toastr';
import {UserRequestInterface} from '../../interfaces/login/google-user-request.interface';
import {SharedService} from '../../services/shared/shared.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subs = [];
  loginForm: FormGroup;

  mail = new FormControl('', [Validators.required]);
  password = new FormControl('', Validators.required);
  role = new FormControl('user');

  constructor(private fb: FormBuilder, private router: Router,
              private socialAuthService: SocialAuthService, private loginService: LoginService,
              private toastr: ToastrService, private sharedService: SharedService) {
    localStorage.clear();
    this.loginForm = fb.group( {
      mail: this.mail,
      password: this.password,
      role: this.role
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(subscription => subscription.unsubscribe);
  }

  ngOnInit(): void {
    if (localStorage.getItem("user") != null) {
      this.router.navigate(['userpage']);
      return;
    }
  }

  loginAsAdmin(): void {
    if (this.loginForm.invalid) return;
    var request: UserRequestInterface = {
      email: this.mail.value,
      password: this.password.value,
      source: "manual"
    };
    const checkAdminSubs = this.loginService.login(request)
    checkAdminSubs.subscribe(
      result => {
        this.subs.push(checkAdminSubs);
        if (result) {
          this.sharedService.editUser("ADMIN");
          localStorage.setItem("token", result.accessToken);
          this.router.navigate(['adminmainpage']);
        } else {
          this.toastr.error('?????????????????????????????? ?????????????????????')
        }
      }, error => {this.toastr.error('?????????????????????????????? ???????????????????????????')}
    )
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        const socialSubs = this.socialAuthService.authState
          socialSubs.subscribe(result => {
          if (result && result.email.includes('freeuni.edu.ge')) {
            var request: UserRequestInterface = {
              firstName: result.firstName,
              lastName: result.lastName,
              email: result.email,
              source: result.provider
            };
            const googleSubs = this.loginService.login(request)
              googleSubs.subscribe(res => {
                this.subs.push(googleSubs);
              if (res) {
                console.log(res);
                this.sharedService.setUser(res);
                this.sharedService.editUser("USER");
                localStorage.setItem("token", res.accessToken);
                localStorage.setItem("id", res['id']);
                localStorage.setItem("personalNo", res.identityNumber);
                localStorage.setItem("phoneNum", res.phoneNumber);
                this.router.navigate(['usermainpage'])
              } else {
                this.toastr.error("?????????????????????????????? ???????????????????????????");
              }
            })
          } else if (result && !result.email.includes('freeuni.edu.ge')) {
            this.toastr.error("?????????????????????????????? ???????????????????????????");
          }

        })
      }).catch(error => console.log(error));
  }


}
