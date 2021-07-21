import { Injectable } from '@angular/core';
import {AdminResponseInterface} from '../../interfaces/login/admin-response.interface';
import {Observable, throwError} from 'rxjs';
import { of } from 'rxjs';
import {UserRequestInterface} from '../../interfaces/login/google-user-request.interface';
import {UserResponseInterface} from '../../interfaces/login/google-user-response.interface';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private BASE_URL = `http://localhost:8080/api/`

  constructor(private http: HttpClient) { }


  login(userInfo: UserRequestInterface): Observable<UserResponseInterface> {
    const requestUrl = this.BASE_URL + `auth/signup`
    return this.http.post<UserResponseInterface>(requestUrl, userInfo)
  }

}
