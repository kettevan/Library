import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {AdminService} from '../../services/admin-services/admin.service';
import {ToastrService} from 'ngx-toastr';
import {BooksAdminService} from '../../services/books-admin/books-admin.service';
import {BooksInterface} from '../../interfaces/admin/main-page/books.interface';
import {MatTableDataSource} from '@angular/material/table';
import {BooksResponseInterface} from '../../interfaces/admin/main-page/books-response.interface';
import {MatPaginator} from '@angular/material/paginator';
import {ViewBookPageComponent} from '../main-page-admin/view-book-page/view-book-page.component';
import {MatDialog} from '@angular/material/dialog';
import {HeaderBookingRequestInterface} from '../../interfaces/admin/booking/header-booking-request.interface';
import {ReservationsService} from '../../services/admin-services/reservations.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header-booking',
  templateUrl: './header-booking.component.html',
  styleUrls: ['./header-booking.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]

})
export class HeaderBookingComponent implements OnInit, AfterViewInit {

  public displayColumns: string[] = ['title', 'author', 'bookCopies', 'rubric', 'actions']
  public booksDatasource = new MatTableDataSource<BooksInterface>();
  public savedBooksArr: BooksInterface[] = []
  public savedBooks = new MatTableDataSource<BooksInterface>(this.savedBooksArr);
  @ViewChild('booksPagination', {static: true}) booksPagination: MatPaginator;
  @ViewChild('savedBooksPagination', {static: true}) savedBooksPagination: MatPaginator;
  readerFormGroup: FormGroup;
  reservedBooksForm: FormGroup;
  booksInfoForm: FormArray = new FormArray([]);


  readerPersonalNum = new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])
  reader = new FormControl(null, [Validators.required]);
  private readerObj = null;

  bookSearchField = new FormControl(null);

  public minDate: Date = new Date();
  public maxDate: Date = new Date();

  public disabledDatesArr = [new Date('08/11/2021').getTime()];

  constructor(private _formBuilder: FormBuilder, private adminService: AdminService,
              private toastr: ToastrService, private booksService: BooksAdminService,
              private dialog: MatDialog, private reservationsService: ReservationsService, private router: Router) {
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
  }


  dateFilter = (d: Date): boolean => {
    const index = this.disabledDatesArr.indexOf(d.getTime())
    return index === -1;
  }

  disableDates(index: any): void {
    const value =  this.booksInfoForm.controls[index].value.bookCopy.bookedDates;
    console.log(value);
  }

  ngOnInit(): void {
    this.readerFormGroup = this._formBuilder.group({
      readerPersonalNum: this.readerPersonalNum,
      reader: this.reader
    });
    this.reservedBooksForm = this._formBuilder.group({
      bookSearchField: this.bookSearchField
    });
  }

  finalStep(): void {
    const request: HeaderBookingRequestInterface[] = []
    for(let i = 0; i < this.booksInfoForm.controls.length; i++) {
      console.log(this.booksInfoForm.controls[i].value);
      request.push({
        borrowerId: this.readerObj.id,
        bookCopyId: this.booksInfoForm.controls[i].value.bookCopy.id,
        startDate: this.booksInfoForm.controls[i].value.startDate,
        endDate: this.booksInfoForm.controls[i].value.endDate,
      })
    }
    this.reservationsService.reserveBook(request).subscribe(result => {
      console.log(result);
      this.toastr.success('წიგნები წარმატებით დაიჯავშნა');
      this.router.navigate(['/adminmainpage']);
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  createFromArray(): void {
    this.booksInfoForm = new FormArray([]);
    for (let i = 0; i < this.savedBooksArr.length; i++) {
      this.booksInfoForm.push(this._formBuilder.group({
        bookTitle: new FormControl(this.savedBooksArr[i].title),
        bookAuthor: new FormControl(this.savedBooksArr[i].author),
        book: new FormControl(this.savedBooksArr[i], [Validators.required]),
        bookCopy: new FormControl('', [Validators.required]),
        startDate: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required])
      }))
    }
    console.log(this.booksInfoForm.controls);
  }

  findBooksWithSearchParam(): void {
    if (this.bookSearchField.invalid) {
      return;
    } else {
      // შესაცვლელია url
      this.booksService.bookingFilter(this.bookSearchField.value).subscribe(result => {
        if (result['content'].length == 0) {
          this.bookSearchField.reset();
          this.toastr.error('წიგნი ვერ მოიძებნა');
          return;
        }
        this.booksDatasource = new MatTableDataSource(result['content']);
        this.booksDatasource.paginator = this.booksPagination;
        console.log(result);
      }, error => {
        this.toastr.error('დაფიქსირდა შეცდომა');
      })
    }
  }

  viewBook(element: BooksInterface): void {
    this.dialog.open(ViewBookPageComponent, {
      data: element,
      width: '1000px',
    })
  }

  addBookInReservedList(element: BooksInterface): void {
    if (this.savedBooksArr.indexOf(element) != -1) {
      this.toastr.error('წიგნი უკვე შენახულია');
      return;
    }
    this.savedBooksArr.push(element);
    this.booksDatasource = new MatTableDataSource<BooksInterface>();
    this.bookSearchField.reset();
    this.savedBooks.paginator = this.savedBooksPagination;
  }

  removeElementFromReservedList(element: BooksInterface): void {
    if (this.savedBooksArr.indexOf(element) == -1) {
      this.toastr.error('დაფიქსირდა შეცდომა');
      return;
    } else {
      this.savedBooksArr = this.savedBooksArr.filter(x => x !== element);
      this.savedBooks = new MatTableDataSource<BooksInterface>(this.savedBooksArr)
      this.toastr.success('წიგნი წარმატებით წაიშალა');
    }
  }

  findReaderByPersonalNum(): void {
    if (this.readerPersonalNum.invalid) {
      this.toastr.error('პირადი ნომერი არასწორია');
      return;
    }
    this.adminService.getUsers(false, this.readerPersonalNum.value).subscribe(result => {
      if (result['content'].length == 1) {
        this.readerObj = result['content'][0]
        this.reader.setValue(this.readerObj.firstName + ' ' + this.readerObj.lastName);
      } else {
        this.readerObj = null;
        this.reader.setValue(null);
        this.toastr.error('დაფიქსირდა შეცდომა');
      }
    })
  }

  deleteBook(index: number): void {
    this.booksInfoForm.removeAt(index);
    this.savedBooksArr = this.savedBooksArr.filter(x => {
      return x !== this.savedBooksArr[index];
    })
    this.savedBooks = new MatTableDataSource(this.savedBooksArr);
    this.savedBooks.paginator = this.savedBooksPagination;
  }

  ngAfterViewInit(): void {
    this.booksDatasource.paginator = this.booksPagination;
    this.savedBooks.paginator = this.savedBooksPagination;
  }

}
