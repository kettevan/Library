import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import jwt_decode from "jwt-decode"
import {LoginComponent} from '../login/login.component';
import {LoginService} from '../../services/login-services/login.service';
import {Observable, of} from 'rxjs';
import {SharedService} from '../../services/shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  public user$: Observable<boolean>;
  public admin$: Observable<boolean>;

  constructor(private sharedService: SharedService) {
    this.sharedService.user.subscribe(result => {
      console.log(result)
      if (result.toUpperCase() === 'ADMIN') {
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


  ngOnInit(): void {
    this.getTokenInfo();
  }

  getTokenInfo() {
    var token = localStorage.getItem('token');
    console.log(token);
    if (token != null) {
      var decoded = jwt_decode(token);
      if (decoded['Role'].toUpperCase() === 'USER') {
        this.user$ = of(true);
        this.admin$ = of(false);
      } else if (decoded['Role'].toUpperCase() === 'ADMIN') {
        this.user$ = of(false);
        this.admin$ = of(true);
      }
    } else {
      this.user$ = of(false);
      this.admin$ = of(false);
    }
  }






}
