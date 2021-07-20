import {Component, OnDestroy, OnInit} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../services/login-services/login.service';
import {ToastrService} from 'ngx-toastr';
import {GoogleUserRequestInterface} from '../interfaces/login/google-user-request.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subs = [];
  loginForm: FormGroup;


  username = new FormControl('', [Validators.required]);
  password = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder, private router: Router,
              private socialAuthService: SocialAuthService, private loginService: LoginService,
              private toastr: ToastrService) {
    this.loginForm = fb.group( {
      username: this.username,
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
    const checkAdminSubs = this.loginService.checkAdminUser(this.username.value, this.password.value)
    checkAdminSubs.subscribe(
      result => {
        this.subs.push(checkAdminSubs);
        if (result) {
          localStorage.setItem("admin", JSON.stringify(result));
          this.router.navigate(['adminpage']);
        } else {
          this.toastr.error('დაფიქსირდა შეცდომა')
        }
      }, error => {console.log(error)}
    )
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        const socialSubs = this.socialAuthService.authState
          socialSubs.subscribe(result => {
            this.subs.push(socialSubs);
          if (result && result.email.includes('freeuni.edu.ge')) {
            var request: GoogleUserRequestInterface = {
              firstName: result.firstName,
              lastName: result.lastName,
              mail: result.email,
              source: result.provider
            };
            const googleSubs = this.loginService.getGoogleUserInfo(request)
              googleSubs.subscribe(res => {
                this.subs.push(googleSubs);
              if (res) {
                localStorage.setItem("token", res.accessToken);
                this.router.navigate(['mainpage'])
              } else {
                this.toastr.error("მონაცემები არასწორია");
              }
            })

          } else {
            this.toastr.error("მონაცემები არასწორია");
          }

        })
      }).catch(error => console.log(error));
  }


}
