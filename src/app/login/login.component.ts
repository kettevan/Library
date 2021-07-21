import {Component, OnDestroy, OnInit} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../services/login-services/login.service';
import { ToastrService } from 'ngx-toastr';
import {UserRequestInterface} from '../interfaces/login/google-user-request.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subs = [];
  loginForm: FormGroup;


  mail = new FormControl('', [Validators.required]);
  password = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder, private router: Router,
              private socialAuthService: SocialAuthService, private loginService: LoginService,
              private toastr: ToastrService) {
    var token = localStorage.getItem('token');
    if (token != null) {
      this.router.navigate(["mainpage"])
    }
    this.loginForm = fb.group( {
      mail: this.mail,
      password: this.password
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
          localStorage.setItem("token", result.accessToken);
          this.router.navigate(['adminpage']);
        } else {
          this.toastr.error('დაფიქსირდა შეცდომა')
        }
      }, error => {this.toastr.error('მონაცემები არასწორია')}
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
                localStorage.setItem("token", res.accessToken);
                this.router.navigate(['mainpage'])
              } else {
                this.toastr.error("მონაცემები არასწორია");
              }
            })
          } else if (result && !result.email.includes('freeuni.edu.ge')) {
            this.toastr.error("მონაცემები არასწორია");
          }

        })
      }).catch(error => console.log(error));
  }


}
