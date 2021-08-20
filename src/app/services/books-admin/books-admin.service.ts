import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {BooksResponseInterface} from '../../interfaces/admin/books/books-response.interface';
import {SharedService} from '../shared/shared.service';
import {BooksInterface} from '../../interfaces/admin/books/books.interface';
import {NewBookRequestInterface} from '../../interfaces/admin/books/new-book-request.interface';
import {CommentInterface, CommentsResponseInterface} from '../../interfaces/admin/books/comment.interface';
import {FavouriteInterface} from '../../interfaces/admin/user/favourite.interface';
import {FavouriteResponseInterface} from '../../interfaces/admin/user/favourite-response.interface';

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

  filterBooks(filterObj: any): Observable<BooksResponseInterface> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `books`;
    return this.http.get<any>(requestUrl, {params: filterObj, headers: {'Authorization': `Bearer ${token}`}})
  }

  bookingFilter(filterValue: string): Observable<BooksResponseInterface> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `books`;
    return this.http.get<any>(requestUrl, {params: {author: filterValue}, headers: {'Authorization': `Bearer ${token}`}})
  }

  comments(page: number, limit: number, bookId: number): Observable<CommentsResponseInterface> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `books/${bookId}/comments?page=${page}&limit=${limit}`;
    return this.http.get<CommentsResponseInterface>(requestUrl, {headers: {'Authorization': `Bearer ${token}`}});
  }

  addNewComment(comment: CommentInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if (!this.shared.isAdminToken(token) && !this.shared.isUserToken(token)) return of(null);
    const requestUrl = this.BASE_URL + `books/comments`;
    return this.http.post<CommentInterface[]>(requestUrl, comment,{headers: {'Authorization': `Bearer ${token}`}});
  }

}

