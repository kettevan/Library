import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SharedService} from '../../services/shared/shared.service';
import {BooksAdminService} from '../../services/books-admin/books-admin.service';
import {BooksResponseInterface} from '../../interfaces/admin/books/books-response.interface';
import {BookDataSource} from '../../data-sources/book-data-source.datasource';
import {MatPaginator} from '@angular/material/paginator';
import {tap} from 'rxjs/operators';
import {BooksInterface} from '../../interfaces/admin/books/books.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ConfirmDeleteDialogComponent} from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SettingsBasicInterface} from '../../interfaces/admin/settings/settings-basic.interface';
import {ViewBookPageComponent} from './view-book-page/view-book-page.component';
import {SettingsService} from '../../services/admin-services/settings.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page-admin.component.html',
  styleUrls: ['./main-page-admin.component.scss']
})
export class MainPageAdminComponent implements OnInit, OnDestroy, AfterViewInit{
  private subs = [];
  public displayColumns: string[] = ['id', 'place', 'title', 'author', 'book_copy', 'isbn', 'publish_year', 'publisher', 'rubric', 'language', 'actions']
  public booksDatasource: BookDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public bookFilterForm: FormGroup;

  publishers: SettingsBasicInterface[] = []
  languages: SettingsBasicInterface[] = []
  rubrics: SettingsBasicInterface[] = []
  types: SettingsBasicInterface[] = []
  forms: SettingsBasicInterface[] = []
  collections: SettingsBasicInterface[] = []

  id = new FormControl(null);
  title = new FormControl(null);
  author = new FormControl(null);
  languageId = new FormControl(null);
  typeId = new FormControl(null);
  formId = new FormControl(null);
  rubricId = new FormControl(null);
  collectionId = new FormControl(null);
  publisherId = new FormControl(null);
  publishDateFrom = new FormControl(null);
  publishDateTo = new FormControl(null);
  edition = new FormControl(null);
  bookCopyId = new FormControl(null);
  bookStatus = new FormControl(null);
  UDC = new FormControl(null);
  ISBN = new FormControl(null);
  createDateFrom = new FormControl(null);
  createDateTo = new FormControl(null);
  booked = new FormControl(false);

  constructor(private route: ActivatedRoute, private booksAdminService: BooksAdminService, private sharedService: SharedService, private router: Router,
              private toastr: ToastrService, private changeDetectorRefs: ChangeDetectorRef, public dialog: MatDialog, private settingsService: SettingsService,
              private fb: FormBuilder) {
    this.booksDatasource = new BookDataSource(this.booksAdminService);
    this.booksDatasource.loadBooks();
    this.bookFilterForm = this.fb.group({
      id: this.id,
      title: this.title,
      author: this.author,
      languageId: this.languageId,
      typeId: this.typeId,
      formId: this.formId,
      rubricId: this.rubricId,
      collectionId: this.collectionId,
      publisherId: this.publisherId,
      publishDateFrom: this.publishDateFrom,
      publishDateTo: this.publishDateTo,
      edition: this.edition,
      bookCopyCode: this.bookCopyId,
      bookStatus: this.bookStatus,
      UDC: this.UDC,
      ISBN: this.ISBN,
      createDateFrom: this.createDateFrom,
      createDateTo: this.createDateTo,
      booked: this.booked
    });
  }

  public filterBooks(): void{
    const filtered = {};
    if (this.bookFilterForm.valid) {
      for (let key in this.bookFilterForm.value) {
        if (this.bookFilterForm.value[key]) {
          filtered[key] = this.bookFilterForm.value[key];
        }
      }
    }
    this.booksDatasource.filterBooks(filtered);
  }

  public clearFilter(): void {
    this.bookFilterForm.reset();
    this.loadBooks();
  }

  public createBook(): void {
    this.router.navigate(['/book'], {relativeTo: this.route});
  }

  public editBook(book: BooksInterface): void {
    this.router.navigate([`/book/${book.id}`], {relativeTo: this.route});
  }

  public deleteBook(book: BooksInterface): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteBookSer(book);
        this.loadBooks();
      }
    })
  }

  public viewBook(book: BooksInterface): void {
    console.log(book);
    this.dialog.open(ViewBookPageComponent, {
      data: book,
      width: '1000px',
    })
  }

  private deleteBookSer(book: BooksInterface) {
    this.booksAdminService.deleteBook(book.id).subscribe(result => {
      if (result) {
        this.toastr.success('??????????????? ?????????????????????????????? ?????????????????????');
        this.loadBooks();
      } else {
        this.toastr.error('?????????????????? ???????????????????????? ?????????????????????????????? ?????????????????????');
      }
    })
  }


  ngAfterViewInit() {
    this.booksDatasource.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();

    this.paginator.page
      .pipe(
        tap(() => this.loadBooks())
      )
      .subscribe();
  }

  private loadBooks() {
    this.booksDatasource.loadBooks(this.paginator.pageIndex+1, this.paginator.pageSize);
  }

  ngOnDestroy(): void {
    this.subs.forEach(subscription => subscription.unsubscribe);
  }

  ngOnInit(): void {
    // ??????????????????????????????????????????
    const publishersSubs = this.settingsService.getAllPublishers()
    publishersSubs.subscribe(result => {
      this.publishers = result
    })
    this.subs.push(publishersSubs);
    // ???????????????
    const languagesSubs = this.settingsService.getAllLanguages()
    languagesSubs.subscribe(result => this.languages = result)
    this.subs.push(languagesSubs);
    // ???????????????????????????
    const rubricsSubs = this.settingsService.getAllGenres()
    rubricsSubs.subscribe(result => this.rubrics = result);
    this.subs.push(rubricsSubs);
    // ??????????????????
    const typesSubs = this.settingsService.getAllTypes();
    typesSubs.subscribe(result => this.types = result);
    this.subs.push(typesSubs);
    // ?????????????????? ?????????????????????
    const formsSubs = this.settingsService.getAllForms();
    formsSubs.subscribe(result => this.forms = result);
    this.subs.push(formsSubs);
    // ??????????????????????????????
    const collectionSubs = this.settingsService.getAllCollections();
    collectionSubs.subscribe(result => this.collections = result);
    this.subs.push(collectionSubs);
  }

  onFileChange(event: any): void {
    const file = (event.target as HTMLInputElement).files[0];
    const formData: FormData = new FormData();
    formData.append('file', file);
    this.booksAdminService.importFile(formData).subscribe(result => {
      this.toastr.success('????????????????????? ?????????????????????????????? ?????????????????????');
      this.loadBooks();
    }, error => {
      this.toastr.error('?????????????????????????????? ?????????????????????');
    })
  }
}
