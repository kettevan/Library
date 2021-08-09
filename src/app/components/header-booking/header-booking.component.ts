import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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

@Component({
  selector: 'app-header-booking',
  templateUrl: './header-booking.component.html',
  styleUrls: ['./header-booking.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]

})
export class HeaderBookingComponent implements OnInit, AfterViewInit {

  public displayColumns: string[] = ['title', 'author', 'publish_year', 'rubric', 'language', 'actions']
  public booksDatasource = new MatTableDataSource<BooksInterface>();
  private savedBooksArr: BooksInterface[] = []
  public savedBooks = new MatTableDataSource<BooksInterface>(this.savedBooksArr);
  @ViewChild('booksPagination', {static: true}) booksPagination: MatPaginator;
  @ViewChild('savedBooksPagination', {static: true}) savedBooksPagination: MatPaginator;
  readerFormGroup: FormGroup;
  reservedBooksForm: FormGroup;

  readerPersonalNum = new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])
  reader = new FormControl(null, [Validators.required]);

  bookSearchField = new FormControl(null, [Validators.required]);
  selectedBooks = new FormControl([], [Validators.required]);


  constructor(private _formBuilder: FormBuilder, private adminService: AdminService,
              private toastr: ToastrService, private booksService: BooksAdminService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.readerFormGroup = this._formBuilder.group({
      readerPersonalNum: this.readerPersonalNum,
      reader: this.reader
    });
    this.reservedBooksForm = this._formBuilder.group({
      bookSearchField: this.bookSearchField,
      selectedBooks: this.selectedBooks
    });
  }

  findBooksWithSearchParam(): void {
    if (this.bookSearchField.invalid) {
      return;
    } else {
      // შესაცვლელია url
      this.booksService.bookingFilter(this.bookSearchField.value).subscribe(result => {
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
    this.savedBooks.paginator = this.savedBooksPagination;
  }

  removeElementFromReservedList(element: BooksInterface): void {
    if (this.savedBooksArr.indexOf(element) == -1) {
      this.toastr.error('დაფიქსირდა შეცდომა');
      return;
    } else {
      this.savedBooksArr = this.savedBooksArr.filter(x => x !== element);
      this.toastr.success('')
    }
  }

  findReaderByPersonalNum(): void {
    if (this.readerPersonalNum.invalid) {
      this.toastr.error('პირადი ნომერი არასწორია');
      return;
    }
    this.adminService.getUsers(false, this.readerPersonalNum.value).subscribe(result => {
      if (result['content'].length == 1) {
        this.reader.setValue(result['content'][0])
        this.reader.setValue(this.reader.value.firstName + ' ' + this.reader.value.lastName);
      } else {
        this.reader.setValue(null);
        this.reader.setValue(null);
        this.toastr.error('დაფიქსირდა შეცდომა');
      }
    })
  }

  ngAfterViewInit(): void {
    this.booksDatasource.paginator = this.booksPagination;
    this.savedBooks.paginator = this.savedBooksPagination;
  }

}
