import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BooksResponseInterface} from '../interfaces/admin/books/books-response.interface';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {BooksInterface} from '../interfaces/admin/books/books.interface';
import {BooksAdminService} from '../services/books-admin/books-admin.service';
import {catchError, finalize} from 'rxjs/operators';

export class BookDataSource implements DataSource<BooksInterface> {


  private booksSubject = new BehaviorSubject<BooksInterface[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();

  constructor(private booksService: BooksAdminService) { }

  connect(collectionViewer: CollectionViewer): Observable<BooksInterface[] | ReadonlyArray<BooksInterface>> {
    return this.booksSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.booksSubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadBooks(pageNumber = 1, pageSize = 20) {
    this.loadingSubject.next(true);
    this.booksService.books(pageNumber, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: BooksResponseInterface) => {
          this.booksSubject.next(result.content);
          this.countSubject.next(result.totalElements);
        }
      );
  }

  filterBooks(filterObj: any) {
    this.loadingSubject.next(true);
    this.booksService.filterBooks(filterObj)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: BooksResponseInterface) => {
          this.booksSubject.next(result.content);
          this.countSubject.next(result.totalElements);
        }
      );
  }

}
