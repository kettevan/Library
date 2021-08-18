import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import jwt_decode from 'jwt-decode';
import {take, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {SocialAuthService} from 'angularx-social-login';
import {SharedService} from '../../services/shared/shared.service';
import {MatPaginator} from '@angular/material/paginator';
import {BooksAdminService} from '../../services/books-admin/books-admin.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SettingsBasicInterface} from '../../interfaces/admin/settings/settings-basic.interface';
import {SettingsService} from '../../services/admin-services/settings.service';

@Component({
  selector: 'app-main-page-user',
  templateUrl: './main-page-user.component.html',
  styleUrls: ['./main-page-user.component.scss']
})
export class MainPageUserComponent implements OnInit, AfterViewInit, OnDestroy {
  public userInfo: any;
  private subs = [];
  public booksDatasource = [];
  private contentSize = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  publishers: SettingsBasicInterface[] = []
  languages: SettingsBasicInterface[] = []
  subjects: SettingsBasicInterface[] = []

  public filterForm: FormGroup;
  author = new FormControl(null);
  title = new FormControl(null);
  subjectId = new FormControl(null);
  publisherId = new FormControl(null);
  languageId = new FormControl(null);

  constructor(private router: Router, private booksAdminService: BooksAdminService,
              public socialAuthService: SocialAuthService, private sharedService: SharedService, private toastr: ToastrService,
              private fb: FormBuilder, private settingsService: SettingsService) {
    const token = localStorage.getItem('token');
    if (token != null && jwt_decode(token)['Role'].toUpperCase() === 'USER') {
      const socialAuthSubs = socialAuthService.authState.pipe(take(1))
      socialAuthSubs.subscribe(result => {
        if (result) {
          this.userInfo = result;
          localStorage.setItem('user', JSON.stringify(result));
        }
      }, error => console.log(error));
      this.subs.push(socialAuthSubs);
    }
  }

  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe);
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      author: this.author,
      title: this.title,
      subjectId: this.subjectId,
      publisherId: this.publisherId,
      languageId: this.languageId
    });
    this.loadBooks(false);
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
    const subjectsSubs = this.settingsService.getAllGenres()
    subjectsSubs.subscribe(result => {
      this.subjects = result,
        console.log(result)
    } );
    this.subs.push(subjectsSubs);
  }

  ngAfterViewInit(): void {
    this.paginator.length = this.contentSize;
    this.paginator.page
      .pipe(
        tap(() => this.loadBooks(true))
      )
      .subscribe();
  }

  public bookDetails(bookId: number): void {
    this.router.navigate([`/book/view/${bookId}`])
  }

  private loadBooks(loaded: boolean) {
    let pageIndex = 1;
    let pageSize = 10;
    if (loaded) {
      pageIndex = this.paginator.pageIndex+1;
      pageSize = this.paginator.pageSize;
    }
    this.booksAdminService.books(pageIndex, pageSize).subscribe(result => {
      this.booksDatasource = result.content;
      this.contentSize = result.totalElements;
      console.log(this.booksDatasource);
      this.paginator.length = result.totalElements;
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

}
