import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {startWith, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {BooksAdminService} from '../../../services/books-admin/books-admin.service';
import {BooksInterface} from '../../../interfaces/admin/books/books.interface';
import {MatDialog} from '@angular/material/dialog';
import {UserBookingPageComponent} from '../user-booking-page/user-booking-page.component';
import {HeaderBookingRequestInterface} from '../../../interfaces/admin/booking/header-booking-request.interface';
import {ReservationsService} from '../../../services/admin-services/reservations.service';
import {ToastrService} from 'ngx-toastr';
import {CommentInterface} from '../../../interfaces/admin/books/comment.interface';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../../services/users/users.service';
import {FavouriteInterface} from '../../../interfaces/admin/user/favourite.interface';
import {MatPaginator} from '@angular/material/paginator';
import {FavouritesNotesDialogComponent} from '../../shared/favourites-notes-dialog/favourites-notes-dialog.component';

@Component({
  selector: 'app-book-details-page',
  templateUrl: './book-details-page.component.html',
  styleUrls: ['./book-details-page.component.scss']
})
export class BookDetailsPageComponent implements OnInit, AfterViewInit {
  public data: BooksInterface = null;
  private bookId: number;
  public comments = []
  private contentSize = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  commentsForm: FormGroup;
  newComment = new FormControl(null, [Validators.required]);

  constructor(private route: ActivatedRoute, private booksService: BooksAdminService, private dialog: MatDialog,
              private reservationService: ReservationsService, private toastr: ToastrService, private fb: FormBuilder,
              private userService: UsersService) {
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
        this.loadComments(false);
      }
    });
  }

  downloadPdf(base64String, fileName) {
    const link = document.createElement("a");
    link.href = base64String;
    link.download = `${fileName}.pdf`
    link.click();
  }

  onClickDownloadPdf(){
    let base64String = this.data.file;
    this.downloadPdf(base64String, this.data.title);
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
      this.loadComments(false);
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
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
          this.toastr.success('წიგნი წარმატებით დაიჯავშნა');
        }, error => {
          this.toastr.error('დაფიქსირდა შეცდომა');
        })
      }
    })
  }

  addToFavourites(): void {
    const userId = +localStorage.getItem('id');
    if (!userId) return;
    const favObj: FavouriteInterface = {
      userId: userId,
      bookId: this.bookId
    }
    this.dialog.open(FavouritesNotesDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(note => {
      console.log(note);
      if (note === undefined || note === null) {
        return;
      }
      if (note !== '') {
        favObj.note = note;
      }
      this.userService.addBookToFavourites(favObj).subscribe(result => {
        if (result) {
          this.toastr.success('წიგნი წარმატებით დაემატა ფავორიტებში');
        }
      }, error => {
        this.toastr.error('დაფიქსირდა შეცდომა / წიგნი უკვე დამატებულია ფავორიტებში');

      })
    })
  }


  private loadComments(loaded: boolean) {
    let pageIndex = 1;
    let pageSize = 5;
    if (loaded) {
      pageIndex = this.paginator.pageIndex+1;
      pageSize = this.paginator.pageSize;
    }
    this.booksService.comments(pageIndex, pageSize, this.bookId).subscribe(result => {
      this.comments = result.content;
      this.contentSize = result.totalElements;
      this.paginator.length = result.totalElements;
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  ngAfterViewInit(): void {
    this.paginator.length = this.contentSize;
    this.paginator.page
      .pipe(
        tap(() => this.loadComments(true))
      )
      .subscribe();
  }
}
