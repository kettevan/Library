import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {UserRequestInterface} from '../../interfaces/login/google-user-request.interface';
import {UserResponseInterface} from '../../interfaces/login/google-user-response.interface';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private BASE_URL = `http://localhost:8080/api/`

  constructor(private http: HttpClient) { }

  login(userInfo: UserRequestInterface): Observable<UserResponseInterface> {
    const requestUrl = this.BASE_URL + `user/signing`
    return this.http.post<UserResponseInterface>(requestUrl, userInfo)
  }

}
