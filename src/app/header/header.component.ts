import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isUser: boolean = false;


  constructor() { }

  ngOnInit(): void {
    var token = localStorage.getItem('token');
    if (token != null) {
      var decoded = jwt_decode(token);
      if (decoded['Role'].toUpperCase() === 'USER') {
        this.isUser = true;
      }
    }
  }

}
