import { Component, OnInit } from '@angular/core';
import {SocialAuthService} from 'angularx-social-login';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  public userInfo: any;

  constructor() {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
  }

}
