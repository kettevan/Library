import {BookHistoryInterface} from '../interfaces/admin/books/book-history.interface';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {BooksAdminService} from '../services/books-admin/books-admin.service';
import {catchError, finalize} from 'rxjs/operators';
import {BooksResponseInterface} from '../interfaces/admin/books/books-response.interface';

export class BookHistoryDataSource implements DataSource<BookHistoryInterface> {

  private booksHistorySubject = new BehaviorSubject<BookHistoryInterface[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();

  constructor(private booksService: BooksAdminService) {}

  connect(collectionViewer: CollectionViewer): Observable<BookHistoryInterface[] | ReadonlyArray<BookHistoryInterface>> {
    return this.booksHistorySubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.booksHistorySubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadBookHistories(bookId: number, pageNumber = 1, pageSize = 10) {
    this.loadingSubject.next(true);
    this.booksService.getBookHistory(bookId, pageNumber, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: any) => {
          this.booksHistorySubject.next(result.content);
          this.countSubject.next(result.totalElements);
        }
      );
  }

  filterHistory(bookId: number, bookCopy: string, pageNumber = 1, pageSize = 10): void {
    this.loadingSubject.next(true);
    this.booksService.filterBookHistory(bookId, bookCopy, pageNumber, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: any) => {
        this.booksHistorySubject.next(result.content);
        this.countSubject.next(result.totalElements);
      })
  }

}
