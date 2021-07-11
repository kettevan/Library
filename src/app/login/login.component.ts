import {Component, OnInit} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;


  email = new FormControl('', [Validators.required]);
  password = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder, private router: Router,
              private socialAuthService: SocialAuthService) {
    this.loginForm = fb.group( {
      userEmail: this.email,
      password: this.password
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem("user") != null) {
      this.router.navigate(['userpage']);
      return;
    }
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        this.router.navigate(['mainpage'])
      });
  }
}
