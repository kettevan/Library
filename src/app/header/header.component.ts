import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import jwt_decode from "jwt-decode"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isUser: boolean = false;
  public isAdmin: boolean = false;


  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getTokenInfo();

    window.addEventListener('storage', this.getTokenInfo)

  }

  getTokenInfo() {
    console.log("shemovida");
    var token = localStorage.getItem('token');
    console.log(token);
    if (token != null) {
      var decoded = jwt_decode(token);
      if (decoded['Role'].toUpperCase() === 'USER') {
        this.isUser = true;
      } else if (decoded['Role'].toUpperCase() === 'ADMIN') {
        this.isAdmin = true;
      }
    } else {
      this.isUser = false;
      this.isAdmin = false;
    }
    console.log(this.isUser);
    this.ref.detectChanges();
  }





}
