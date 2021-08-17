import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../shared/shared.service';
import {Observable, of} from 'rxjs';
import {CreateAdminInterface} from '../../interfaces/admin/create-admin.interface';
import {FavouriteInterface} from '../../interfaces/admin/user/favourite.interface';

@Injectable({
  providedIn: 'root',
})

export class UsersService {

  private USERS_BASE_UEL = `http://localhost:8080/api/users/`

  constructor(private http: HttpClient, private shared: SharedService) {
  }

  editUserPhone(userId: number, user: CreateAdminInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.USERS_BASE_UEL + `${userId}`
    this.http.put(requestUrl, user, { headers: {'Authorization': `Bearer ${token}`} })
  }

  addBookToFavourites(favourite: FavouriteInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isUserToken(token) || !this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.USERS_BASE_UEL + `favourites`
    this.http.post(requestUrl, favourite, { headers: {'Authorization': `Bearer ${token}`}})
  }
}
