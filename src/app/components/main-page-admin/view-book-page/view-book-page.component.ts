import {Component, OnInit, Inject, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {BookCopyInterface, BookCopyStatuses, BooksInterface} from '../../../interfaces/admin/books/books.interface';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {BookingPageComponent} from '../booking-page/booking-page.component';
import {ReservationsService} from '../../../services/admin-services/reservations.service';
import {ToastrService} from 'ngx-toastr';
import {BooksReservationRequestInterface} from '../../../interfaces/admin/books/books-reservation.interface';
import {HeaderBookingRequestInterface} from '../../../interfaces/admin/booking/header-booking-request.interface';
import {BehaviorSubject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {BooksAdminService} from '../../../services/books-admin/books-admin.service';
import {ReservationConformationDialogComponent} from '../../shared/reservation-conformation-dialog/reservation-conformation-dialog.component';
import {BookDataSource} from '../../../data-sources/book-data-source.datasource';
import {BookHistoryDataSource} from '../../../data-sources/book-history-data-source.datasource';

@Component({
  selector: 'app-view-book-page',
  templateUrl: './view-book-page.component.html',
  styleUrls: ['./view-book-page.component.scss']
})

export class ViewBookPageComponent implements OnInit, AfterViewInit {

  bookCopies: BookCopyInterface[] = [];
  lentBookCopies: BookCopyInterface[] = [];

  booksCopyDataSource = new MatTableDataSource<BookCopyInterface>();
  lentBooksCopyDataSource = new MatTableDataSource<BookCopyInterface>();

  @ViewChild('bookCopiesPaginator', {static: true}) paginator: MatPaginator;
  @ViewChild('lentBookCopiesPaginator', {static: true}) lentBookPaginator: MatPaginator;

  public bookHistoryDataSource: BookHistoryDataSource;

  displayColumns: string[] = ['code', 'status', 'action']

  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: BooksInterface,
              public dialog: MatDialog, private reservationService: ReservationsService, private toastr: ToastrService,
              private changeDetectorRefs: ChangeDetectorRef, private booksAdminService: BooksAdminService) {

    this.bookHistoryDataSource = new BookHistoryDataSource(this.booksAdminService);
    this.bookHistoryDataSource.loadBookHistories(this.data.id);


    // this.booksAdminService.getBookHistory(this.data.id).subscribe(result => {
    //   console.log(result);
    // }, error => {
    //   console.log(error);
    // })

    this.bookCopies = this.data.bookCopies.filter(x => x.status === "PRESENT")
    this.lentBookCopies = this.data.bookCopies.filter(x => x.status === "LENT")

    this.booksCopyDataSource = new MatTableDataSource<BookCopyInterface>(this.bookCopies);
    this.lentBooksCopyDataSource = new MatTableDataSource<BookCopyInterface>(this.lentBookCopies);
  }


  ngOnInit(): void {
    this.booksCopyDataSource.filterPredicate = function(data, filter: string): boolean {
      return data.code.toLowerCase().includes(filter);
    };

    this.lentBooksCopyDataSource.filterPredicate = function(data, filter: string): boolean {
      return data.code.toLowerCase().includes(filter);
    };
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.booksCopyDataSource.filter = filterValue;
  }

  lentCopiesFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lentBooksCopyDataSource.filter = filterValue;
  }

  onBookingClick(bookCopy: BookCopyInterface): void {
    this.dialog.open(BookingPageComponent, {
      width: '400px',
      data: bookCopy
    }).afterClosed().subscribe(result => {
      if (result) {
        this.reserveBook(result, bookCopy);
      }
    })
  }

  private reserveBook(reservationInfo: any, bookCopy: BookCopyInterface): void {
    const request: HeaderBookingRequestInterface[] = []
    request.push({
      bookCopyId: bookCopy.id,
      borrowerId: reservationInfo.readersObj.id,
      startDate: reservationInfo.dateFrom,
      endDate: reservationInfo.dateTo
    })
    this.reservationService.reserveBook(request).subscribe(result => {
      if (result) {
        this.reloadBookCopiesData()
        this.toastr.success('წიგნი წარმატებით დაიჯავშნა');
      }
    }, error =>  {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private reloadBookCopiesData(): void {
    this.booksAdminService.getBookById(this.data.id).subscribe(result => {
      this.bookCopies = result.bookCopies.filter(x => x.status === "PRESENT")
      this.lentBookCopies = result.bookCopies.filter(x => x.status === "LENT")

      this.booksCopyDataSource = new MatTableDataSource<BookCopyInterface>(this.bookCopies);
      this.lentBooksCopyDataSource = new MatTableDataSource<BookCopyInterface>(this.lentBookCopies);
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  receiveBook(element: any): void {
    this.dialog.open(ReservationConformationDialogComponent, {
      width: '400px',
      data: 'ადასტურებთ წიგნის მიღებას?'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.receiveBookServ(element);
      }
    })
  }

  private receiveBookServ(element: any): void {
    this.booksAdminService.returnBookCopyAdmin(element.id).subscribe(result => {
      console.log(result);
      this.toastr.success('წიგნი წარმატებით ჩაბარდა');
      this.reloadBookCopiesData();
    }, error => {
      console.log(error);
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    this.booksCopyDataSource.paginator = this.paginator;
    this.lentBooksCopyDataSource.paginator = this.lentBookPaginator;
  }
}
