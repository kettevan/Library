import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {UsersResponseInterface} from '../../interfaces/admin/users-response.interface';
import {CreateAdminInterface} from '../../interfaces/admin/create-admin.interface';
import {SharedService} from '../shared/shared.service';
import {SettingsBasicInterface} from '../../interfaces/admin/settings/settings-basic.interface';

@Injectable({
  providedIn: 'root',
})

export class AdminService {

  private BASE_URL = `http://localhost:8080/api/`

  constructor(private http: HttpClient, private shared: SharedService) { }

  getUsers(admin: boolean, personalNo?: string): Observable<UsersResponseInterface[]>{
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    let requestUrl = this.BASE_URL + `users?admin=${admin}&page=1&limit=200`;
    if (personalNo) {
      requestUrl = this.BASE_URL + `users?admin=${admin}&personalNo=${personalNo}&page=1&limit=1`;
    }
    return this.http.get<UsersResponseInterface[]>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}});
  }

  createAdmin(newAdmin: CreateAdminInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `users`;
    return this.http.post(requestUrl, newAdmin, { headers: {'Authorization': `Bearer ${token}`} });
  }

  deleteUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `users/${userId}`;
    return this.http.delete(requestUrl, { headers: {'Authorization': `Bearer ${token}`} });
  }
}
