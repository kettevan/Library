import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../shared/shared.service';
import {Observable, of} from 'rxjs';
import {FavouriteInterface} from '../../interfaces/admin/user/favourite.interface';
import {FavouriteResponseInterface} from '../../interfaces/admin/user/favourite-response.interface';
import {UserResponseInterface} from '../../interfaces/admin/user/user-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private USERS_BASE_UEL = `http://localhost:8080/api/users/`

  constructor(public http: HttpClient, private shared: SharedService) {
  }

  getUserInfo(userId: number): Observable<UserResponseInterface> {
    const token = localStorage.getItem('token');
    if (!this.shared.isUserToken(token) && !this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.USERS_BASE_UEL + `${userId}`
    return this.http.get<UserResponseInterface>(requestUrl, { headers: {'Authorization': `Bearer ${token}`} })
  }

  editUserPhone(userId: number, user: UserResponseInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.USERS_BASE_UEL + `${userId}`
    return this.http.put(requestUrl, user, { headers: {'Authorization': `Bearer ${token}`} })
  }

  addBookToFavourites(favourite: FavouriteInterface): Observable<FavouriteResponseInterface> {
    const token = localStorage.getItem('token');
    if (!this.shared.isUserToken(token) && !this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.USERS_BASE_UEL + `favourites`
    return this.http.post<FavouriteResponseInterface>(requestUrl, favourite, { headers: {'Authorization': `Bearer ${token}`}})
  }

  favouritesByUser(userId: number): Observable<FavouriteInterface[]> {
    const token = localStorage.getItem('token');
    if (!this.shared.isUserToken(token) && !this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.USERS_BASE_UEL + `${userId}/favourites`
    return this.http.get<FavouriteInterface[]>(requestUrl, { headers: {'Authorization': `Bearer ${token}`}})
  }

  deleteFromFavourite(favouriteId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isUserToken(token) && !this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.USERS_BASE_UEL + `favourites/${favouriteId}`
    return this.http.delete<any>(requestUrl, { headers: {'Authorization': `Bearer ${token}`}})
  }

  importFile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token)) return of(null);
    const requestUrl = this.USERS_BASE_UEL + `_import`;
    return this.http.post<any>(requestUrl,formData,{headers: {'Authorization': `Bearer ${token}`}});
  }
}
