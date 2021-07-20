import { Injectable } from '@angular/core';
import {AdminResponseInterface} from '../../interfaces/login/admin-response.interface';
import {Observable, throwError} from 'rxjs';
import { of } from 'rxjs';
import {GoogleUserRequestInterface} from '../../interfaces/login/google-user-request.interface';
import {GoogleUserResponseInterface} from '../../interfaces/login/google-user-response.interface';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private BASE_URL = `http://localhost:8080/api/`

  constructor(private http: HttpClient) { }


  getGoogleUserInfo(userInfo: GoogleUserRequestInterface): Observable<GoogleUserResponseInterface> {
    const requestUrl = this.BASE_URL + `auth/signup`
    return this.http.post<GoogleUserResponseInterface>(requestUrl, userInfo)
  }

  checkAdminUser(username: string, password: string): Observable<AdminResponseInterface> {
    if (username === 'admin' && password === 'admin') {

      return of({
        username: 'admin',
        isAdmin: true,
        role: 'ADMIN'
      })
    }
    return of(null);
  }

}
