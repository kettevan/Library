import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {UsersResponseInterface} from '../../interfaces/admin/users-response.interface';
import {CreateAdminInterface} from '../../interfaces/admin/create-admin.interface';

@Injectable({
  providedIn: 'root',
})

export class AdminService {

  private BASE_URL = `http://localhost:8080/api/`

  constructor(private http: HttpClient) { }

  getAdminUsers(): Observable<UsersResponseInterface[]>{
    const token = localStorage.getItem('token');
    if (token == null) return null;
    const requestUrl = this.BASE_URL + `user`;
    return this.http.get<UsersResponseInterface[]>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}});
  }

  createAdmin(newAdmin: CreateAdminInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (token == null) return of(null);
    const requestUrl = this.BASE_URL + `user`;
    return this.http.post(requestUrl, newAdmin, { headers: {'Authorization': `Bearer ${token}`} });
  }

}
