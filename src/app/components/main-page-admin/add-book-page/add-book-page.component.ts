import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SettingsService} from '../../../services/admin-services/settings.service';
import {SettingsBasicInterface} from '../../../interfaces/admin/settings/settings-basic.interface';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-add-book-page',
  templateUrl: './add-book-page.component.html',
  styleUrls: ['./add-book-page.component.scss']
})
export class AddBookPageComponent implements OnInit, OnDestroy {
  subs = [];
  newBookForm: FormGroup;

  author = new FormControl('', [Validators.required]);
  title = new FormControl('', [Validators.required]);
  subtitle = new FormControl('');
  edition = new FormControl('');
  note = new FormControl('');
  ISBN = new FormControl('', [Validators.required]);
  publisherId = new FormControl('');
  publishDate = new FormControl('');
  languageId = new FormControl('');
  pageNumber = new FormControl('');
  UDC = new FormControl('');
  rubricId = new FormControl('');
  formId = new FormControl('');
  typeId = new FormControl('');
  link = new FormControl('');
  collectionId = new FormControl('');
  file = new FormControl('');
  place = new FormControl('');
  price = new FormControl('');

  publishers: SettingsBasicInterface[] = []
  languages: SettingsBasicInterface[] = []
  rubrics: SettingsBasicInterface[] = []
  types: SettingsBasicInterface[] = []
  forms: SettingsBasicInterface[] = []
  collections: SettingsBasicInterface[] = []

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
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

  uploadFile(event: Event): void {
    console.log('ფაილის ატვირთვა')
  }

  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe());
  }

}
