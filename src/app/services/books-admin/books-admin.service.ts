import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {BooksResponseInterface} from '../../interfaces/admin/main-page/books-response.interface';
import {SharedService} from '../shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class BooksAdminService {

  private BASE_URL = `http://localhost:8080/api/`

  constructor(private http: HttpClient, private shared: SharedService) { }

  books(page: number, limit: number): Observable<BooksResponseInterface> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `books?page=${page}&limit=${limit}`;
    return this.http.get<BooksResponseInterface>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}});
  }

}
