import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {BooksResponseInterface} from '../../interfaces/admin/main-page/books-response.interface';
import {SharedService} from '../shared/shared.service';
import {BooksInterface} from '../../interfaces/admin/main-page/books.interface';
import {NewBookRequestInterface} from '../../interfaces/admin/main-page/new-book-request.interface';

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

  addBook(book: NewBookRequestInterface): Observable<BooksInterface> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `books`;
    return this.http.post<BooksInterface>(requestUrl, book, {headers: {'Authorization': `Bearer ${token}`}});
  }

  getBookById(id: number): Observable<BooksInterface> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `books/${id}`;
    return this.http.get<BooksInterface>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}})
  }

  updateBook(id: number, book: NewBookRequestInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `books/${id}`;
    return this.http.put<any>(requestUrl, book, {headers: {'Authorization': `Bearer ${token}`}})
  }

  deleteBook(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `books/${id}`;
    return this.http.delete<any>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}})
  }

}
