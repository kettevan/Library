import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ReservationsInterface} from '../interfaces/admin/booking/reservations.interface';
import {BooksInterface} from '../interfaces/admin/books/books.interface';
import {ReservationsService} from '../services/admin-services/reservations.service';
import {catchError, finalize} from 'rxjs/operators';
import {BooksResponseInterface} from '../interfaces/admin/books/books-response.interface';

export class ReservationsDataSource implements DataSource<ReservationsInterface> {

  private reservationsSubject = new BehaviorSubject<ReservationsInterface[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();

  constructor(private reservationsService: ReservationsService) { }

  connect(collectionViewer: CollectionViewer): Observable<ReservationsInterface[] | ReadonlyArray<ReservationsInterface>> {
    return this.reservationsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.reservationsSubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadReservations(pageNumber = 1, pageSize = 20) {
    this.loadingSubject.next(true);
    this.reservationsService.reservations(pageNumber, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: any) => {
          console.log(result.content);
          this.reservationsSubject.next(result.content);
          this.countSubject.next(result.totalElements);
        }
      );
  }

  filterReservations(filterObj: any) {
    this.loadingSubject.next(true);
    this.reservationsService.filterReservations(filterObj)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe((result: any) => {
        this.reservationsSubject.next(result.content);
        this.countSubject.next(result.totalElements);
    })
  }

}
