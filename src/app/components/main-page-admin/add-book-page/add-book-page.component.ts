import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SettingsService} from '../../../services/admin-services/settings.service';
import {SettingsBasicInterface} from '../../../interfaces/admin/settings/settings-basic.interface';
import {BooksAdminService} from '../../../services/books-admin/books-admin.service';
import {NewBookRequestInterface} from '../../../interfaces/admin/main-page/new-book-request.interface';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {SettingEditDialogComponent} from '../../admin-page/setting-edit-dialog/setting-edit-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatListOption} from '@angular/material/list';
import {BookCopyInterface} from '../../../interfaces/admin/main-page/books.interface';

@Component({
  selector: 'app-add-book-page',
  templateUrl: './add-book-page.component.html',
  styleUrls: ['./add-book-page.component.scss']
})
export class AddBookPageComponent implements OnInit, OnDestroy {
  subs = [];
  newBookForm: FormGroup;

  author = new FormControl(null, [Validators.required]);
  title = new FormControl( null, [Validators.required]);
  subtitle = new FormControl(null);
  edition = new FormControl(null);
  note = new FormControl(null);
  ISBN = new FormControl(null, [Validators.required]);
  publisherId = new FormControl(null);
  publishDate = new FormControl(null);
  languageId = new FormControl(null);
  pageNumber = new FormControl(null);
  UDC = new FormControl(null);
  rubricId = new FormControl(null);
  formId = new FormControl(null);
  typeId = new FormControl(null);
  link = new FormControl(null);
  collectionId = new FormControl(null);
  file = new FormControl(null);
  place = new FormControl(null);
  price = new FormControl(null);

  publishers: SettingsBasicInterface[] = []
  languages: SettingsBasicInterface[] = []
  rubrics: SettingsBasicInterface[] = []
  types: SettingsBasicInterface[] = []
  forms: SettingsBasicInterface[] = []
  collections: SettingsBasicInterface[] = []

  bookCopies: string[] = []

  constructor(private fb: FormBuilder,
              private settingsService: SettingsService,
              private booksService: BooksAdminService,
              private router: Router,
              private toastr: ToastrService, public dialog: MatDialog) {
    this.newBookForm = fb.group( {
      author: this.author,
      title: this.title,
      subtitle: this.subtitle,
      edition: this.edition,
      note: this.note,
      ISBN: this.ISBN,
      publisherId: this.publisherId,
      publishDate: this.publishDate,
      languageId: this.languageId,
      typeId: this.typeId,
      pageNumber: this.pageNumber,
      UDC: this.UDC,
      rubricId: this.rubricId,
      formId: this.formId,
      link: this.link,
      collectionId: this.collectionId,
      file: this.file,
      place: this.place,
      price: this.price
    })
  }

  ngOnInit(): void {
    // გამომცემლობები
    const publishersSubs = this.settingsService.getAllPublishers()
    publishersSubs.subscribe(result => {
      this.publishers = result
    })
    this.subs.push(publishersSubs);
    // ენები
    const languagesSubs = this.settingsService.getAllLanguages()
    languagesSubs.subscribe(result => this.languages = result)
    this.subs.push(languagesSubs);
    // რუბრიკები
    const rubricsSubs = this.settingsService.getAllGenres()
    rubricsSubs.subscribe(result => this.rubrics = result);
    this.subs.push(rubricsSubs);
    // ტიპები
    const typesSubs = this.settingsService.getAllTypes();
    typesSubs.subscribe(result => this.types = result);
    this.subs.push(typesSubs);
    // წიგნის სახეები
    const formsSubs = this.settingsService.getAllForms();
    formsSubs.subscribe(result => this.forms = result);
    this.subs.push(formsSubs);
    // კოლექციები
    const collectionSubs = this.settingsService.getAllCollections();
    collectionSubs.subscribe(result => this.collections = result);
    this.subs.push(collectionSubs);
  }

  addBookCopy(): void {
    console.log('book copy');
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: null
    }).afterClosed().subscribe(result => {
      if (result) {
        this.bookCopies.push(result.name);
        console.log(result.name);
      }
    })
  }

  deleteCopy(copies: MatListOption[]): void {
    const copiesCodesToDelete = copies.map(x => x.value)
    this.bookCopies = this.bookCopies.filter(x => copiesCodesToDelete.indexOf(x) == -1)
  }

  uploadFile(event: Event): void {
    console.log('ფაილის ატვირთვა')
  }

  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe);
  }

  onCancelClick(): void {
    this.router.navigate(["adminmainpage"]);
  }


  onCreateClick(): void {
    const bookCopiesResult = this.bookCopies.map(x => {
      const res: BookCopyInterface = {
        code: x
      }
      return res;
    })
    console.log(bookCopiesResult);
    const newBook: NewBookRequestInterface = {
      title: this.title.value,
      author: this.author.value,
      note: this.note.value,
      publishDate: this.publishDate.value,
      subjectId: this.rubricId.value,
      languageId: this.languageId.value,
      fundId: this.collectionId.value,
      publisherId: this.publisherId.value,
      resourceTypeId: this.typeId.value,
      resourceFormId: this.formId.value,
      isbn: this.ISBN.value,
      bookCopies: bookCopiesResult
    }
    this.booksService.addBook(newBook).subscribe(result => {
      if (result) {
        this.toastr.success('წიგნი წარმატებით შეიქმნა');
        this.router.navigate(["adminmainpage"]);
      } else {
        this.toastr.error('დაფიქსირდა შეცდომა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }
}
