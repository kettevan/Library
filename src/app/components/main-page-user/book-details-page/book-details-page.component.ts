import { Component, OnInit } from '@angular/core';
import {startWith} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {BooksAdminService} from '../../../services/books-admin/books-admin.service';
import {BooksInterface} from '../../../interfaces/admin/main-page/books.interface';
import {MatDialog} from '@angular/material/dialog';
import {UserBookingPageComponent} from '../user-booking-page/user-booking-page.component';
import {HeaderBookingRequestInterface} from '../../../interfaces/admin/booking/header-booking-request.interface';
import {SocialAuthService} from 'angularx-social-login';
import {ReservationsService} from '../../../services/admin-services/reservations.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-book-details-page',
  templateUrl: './book-details-page.component.html',
  styleUrls: ['./book-details-page.component.scss']
})
export class BookDetailsPageComponent implements OnInit {
  private userData = null;
  public data: BooksInterface = null;
  private bookId: number;

  constructor(private route: ActivatedRoute, private booksService: BooksAdminService, private dialog: MatDialog,
              private reservationService: ReservationsService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.route.params.pipe(startWith(this.route.snapshot.params)).subscribe(params => {
      const id = parseInt(params.id, 10);
      if (isFinite(id)) {
        this.bookId = id;
        this.booksService.getBookById(id).subscribe(result => {
          this.data = result;
        })
      }
    });
  }

  booking(): void {
    this.dialog.open(UserBookingPageComponent, {
      width: '400px',
      data: this.data
    }).afterClosed().subscribe(result => {
      if (result) {
        const bookingInfo: HeaderBookingRequestInterface = {
          borrowerId: +localStorage.getItem('id'),
          bookCopyId: result.bookCopy.id,
          startDate: result.startDate,
          endDate: result.endDate
        }
        this.reservationService.reserveUserBook(bookingInfo).subscribe(result => {
          console.log(result);
          this.toastr.success('წიგნი წარმატებით დაიჯავშნა');
        }, error => {
          this.toastr.error('დაფიქსირდა შეცდომა');
        })
      }
      console.log(result);
    })
  }

}
