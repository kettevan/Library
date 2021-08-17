import { Component, OnInit } from '@angular/core';
import {startWith, switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {BooksAdminService} from '../../../services/books-admin/books-admin.service';
import {BooksInterface} from '../../../interfaces/admin/main-page/books.interface';
import {MatDialog} from '@angular/material/dialog';
import {UserBookingPageComponent} from '../user-booking-page/user-booking-page.component';
import {HeaderBookingRequestInterface} from '../../../interfaces/admin/booking/header-booking-request.interface';
import {SocialAuthService} from 'angularx-social-login';
import {ReservationsService} from '../../../services/admin-services/reservations.service';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs';
import {CommentInterface} from '../../../interfaces/admin/main-page/comment.interface';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-book-details-page',
  templateUrl: './book-details-page.component.html',
  styleUrls: ['./book-details-page.component.scss']
})
export class BookDetailsPageComponent implements OnInit {
  private userData = null;
  public data: BooksInterface = null;
  private bookId: number;
  commentsRequest$ = new BehaviorSubject<boolean>(true);
  comments$;
  public comments: CommentInterface[] = []

  commentsForm: FormGroup;
  newComment = new FormControl(null, [Validators.required]);

  constructor(private route: ActivatedRoute, private booksService: BooksAdminService, private dialog: MatDialog,
              private reservationService: ReservationsService, private toastr: ToastrService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.commentsForm = this.fb.group({
      newComment: this.newComment
    });
    this.route.params.pipe(startWith(this.route.snapshot.params)).subscribe(params => {
      const id = parseInt(params.id, 10);
      if (isFinite(id)) {
        this.bookId = id;
        this.booksService.getBookById(id).subscribe(result => {
          this.data = result;
        })
        this.comments$ = this.commentsRequest$.pipe(switchMap(() => this.booksService.comments(this.bookId)))
        this.comments$.subscribe(result => {
          this.comments = result;
          console.log(this.comments);
        }, error => console.log(error));
      }
    });
  }

  addComment(): void {
    if (this.commentsForm.invalid) return;
    const comment: CommentInterface = {
      comment: this.newComment.value,
      bookId: this.bookId,
      userId: +localStorage.getItem('id')
    }
   this.booksService.addNewComment(comment).subscribe(result => {
      this.toastr.success('კომენტარი წარმატებით დაემატა');
      this.commentsForm.reset();
      this.commentsRequest$.next(true);
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
      console.log(error);
    })
  }

  booking(): void {
    this.dialog.open(UserBookingPageComponent, {
      width: '400px',
      data: this.data
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
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
    })
  }

  addToFavourites(): void {
    console.log('added to favourites')
  }

}
