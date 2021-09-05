import {Component, Input, OnDestroy, OnInit, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SettingsService} from '../../../services/admin-services/settings.service';
import {SettingsBasicInterface} from '../../../interfaces/admin/settings/settings-basic.interface';
import {BooksAdminService} from '../../../services/books-admin/books-admin.service';
import {NewBookRequestInterface} from '../../../interfaces/admin/books/new-book-request.interface';
import {ActivatedRoute, Event, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {SettingEditDialogComponent} from '../../admin-page/setting-edit-dialog/setting-edit-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatListOption} from '@angular/material/list';
import {BookCopyInterface, BooksInterface} from '../../../interfaces/admin/books/books.interface';
import {Observable, of} from 'rxjs';
import {startWith} from 'rxjs/operators';

@Component({
  selector: 'app-add-book-page',
  templateUrl: './add-book-page.component.html',
  styleUrls: ['./add-book-page.component.scss']
})
export class AddBookPageComponent implements OnInit, OnDestroy {
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
  @ViewChild('imageUpload', {static: false}) imageUpload: ElementRef;
  public uploading: boolean = false;
  public imageUploading: boolean = false;

  private data: BooksInterface = null;
  subs = [];
  newBookForm: FormGroup;
  private bookId: number;

  id = new FormControl(null);
  author = new FormControl(null, [Validators.required]);
  title = new FormControl( null, [Validators.required]);
  subtitle = new FormControl(null);
  edition = new FormControl(null);
  note = new FormControl(null);
  ISBN = new FormControl(null, [Validators.required]);
  publisherId = new FormControl(null);
  publishDate = new FormControl(null);
  createDate = new FormControl(null);
  languageId = new FormControl(null);
  pageNumber = new FormControl(null);
  UDC = new FormControl(null);
  active = new FormControl(null);
  rubricId = new FormControl(null);
  formId = new FormControl(null);
  typeId = new FormControl(null);
  link = new FormControl(null);
  collectionId = new FormControl(null);
  public file = new FormControl(null);
  place = new FormControl(null);
  price = new FormControl(null);
  image = new FormControl(null);

  publishers: SettingsBasicInterface[] = []
  languages: SettingsBasicInterface[] = []
  rubrics: SettingsBasicInterface[] = []
  types: SettingsBasicInterface[] = []
  forms: SettingsBasicInterface[] = []
  collections: SettingsBasicInterface[] = []

  bookCopies: BookCopyInterface[] = []

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
              private settingsService: SettingsService,
              private booksService: BooksAdminService,
              private router: Router,
              private toastr: ToastrService, public dialog: MatDialog) {
    // id უნდა ამოვიღო Url-დან და ისე მივიღო data
    this.route.params.pipe(startWith(this.route.snapshot.params)).subscribe(params => {
      const id = parseInt(params.id, 10);
      if (isFinite(id)) {
        this.bookId = id;
        // გამოვიძახო სერვისი და მივიღო წიგნზე ინფო
        this.booksService.getBookById(id).subscribe(result => {
          this.data = result;
          this.setDataValues()
        })
      }
    });
    this.newBookForm = fb.group( {
      id: this.id,
      author: this.author,
      title: this.title,
      subtitle: this.subtitle,
      edition: this.edition,
      note: this.note,
      ISBN: this.ISBN,
      active: this.active,
      publisherId: this.publisherId,
      publishDate: this.publishDate,
      createDate: this.createDate,
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
      price: this.price,
      image: this.image
    })
  }

  private setDataValues(): void {
    if (this.data != null) {
      this.id.setValue(this.data.id);
      this.author.setValue(this.data.author);
      this.title.setValue(this.data.title);
      this.subtitle.setValue(this.data.subtitle);
      this.edition.setValue(this.data.edition);
      this.note.setValue(this.data.note);
      this.ISBN.setValue(this.data.isbn);
      if (this.data.publisher) {
        this.publisherId.setValue(this.data.publisher.id);
      }
      this.active.setValue(this.data.active);
      this.publishDate.setValue(this.data.publishDate);
      if (this.data.language) {
        this.languageId.setValue(this.data.language.id);
      }
      this.createDate.setValue(this.data.createDate);
      this.pageNumber.setValue(this.data.pageNumber);
      this.UDC.setValue(this.data.udc);
      if (this.data.rubric) {
        this.rubricId.setValue(this.data.rubric.id);
      }
      if (this.data.resourceForm) {
        this.formId.setValue(this.data.resourceForm.id);
      }
      if (this.data.resourceType) {
        this.typeId.setValue(this.data.resourceType.id);
      }
      this.link.setValue(this.data.link);
      if (this.data.fund) {
        this.collectionId.setValue(this.data.fund.id);
      }
      this.file.setValue(this.data.file);
      this.image.setValue(this.data.coverImage);
      this.place.setValue(this.data.place);
      this.price.setValue(this.data.price);
      this.bookCopies = this.data.bookCopies;
    }
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
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: null
    }).afterClosed().subscribe(result => {
      if (result) {
        const newBookCopy: BookCopyInterface = {
          code: result.name
        }
        this.bookCopies.push(newBookCopy);
      }
    })
  }

  deleteCopy(copies: MatListOption[]): void {
    const copiesCodesToDelete = copies.map(x => x.value)
    this.bookCopies = this.bookCopies.filter(x => copiesCodesToDelete.indexOf(x) == -1)
  }

  onFileChange(event: any): void {
    this.uploading = true;
    const uploaded = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(uploaded);
    reader.onload = (event: any) => {
      this.file.setValue(reader.result);
      this.toastr.success('ფაილი წარმატებით აიტვირთა');
      this.uploading = false;
    };
    reader.onerror = (error) => {
      this.uploading = false;
      this.toastr.error('დაფიქსირდა შეცდომა');
      console.log('Error: ', error);
    };

  }

  onImageChange(event: any): void {
    this.imageUploading = true;
    const uploaded = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(uploaded);
    reader.onload = (event: any) => {
      this.image.setValue(reader.result);
      this.imageUploading = false;
      this.toastr.success('სურათი წარმატებით აიტვირთა');
    };
    reader.onerror = (error) => {
      this.imageUploading = false;
      this.toastr.error('დაფიქსირდა შეცდომა');
    };
  }

  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe);
  }

  onCancelClick(): void {
    this.router.navigate(["adminmainpage"]);
  }

  private createBook(book: NewBookRequestInterface): void {
    this.booksService.addBook(book).subscribe(result => {
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

  private updateBook(book: NewBookRequestInterface): void {
    this.booksService.updateBook(book.id, book).subscribe(result => {
      if (result) {
        this.toastr.success('წიგნი წარმატებით განახლდა');
        this.router.navigate(["adminmainpage"]);
      } else {
        this.toastr.error('დაფიქსირდა შეცდომა');
      }
    }, error => {
      console.log(error);
    })
  }

  onCreateClick(): void {
    if (this.newBookForm.invalid) {
      this.toastr.error('არასაკმარისი ინფორმაცია');
      return;
    }
    const newBook: NewBookRequestInterface = {
      id: this.id.value,
      title: this.title.value,
      subtitle: this.subtitle.value,
      author: this.author.value,
      note: this.note.value,
      edition: this.edition.value,
      active: this.active.value,
      publishDate: this.publishDate.value,
      createDate: this.createDate.value,
      rubricId: this.rubricId.value,
      languageId: this.languageId.value,
      fundId: this.collectionId.value,
      publisherId: this.publisherId.value,
      resourceTypeId: this.typeId.value,
      resourceFormId: this.formId.value,
      isbn: this.ISBN.value,
      udc: this.UDC.value,
      link: this.link.value,
      place: this.place.value,
      file: this.file.value,
      bookCopies: this.bookCopies,
      coverImage: this.image.value
    }
    if (this.data == null) {
      this.createBook(newBook)
    } else {
      this.updateBook(newBook);
    }

  }
}
