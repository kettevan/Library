import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../services/admin-services/admin.service';
import {MatTableDataSource} from '@angular/material/table';
import {UsersResponseInterface} from '../../interfaces/admin/users-response.interface';
import {MatPaginator} from '@angular/material/paginator';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {CreateAdminDialogComponent} from './create-admin-dialog/create-admin-dialog.component';
import {CreateAdminInterface} from '../../interfaces/admin/create-admin.interface';
import {BehaviorSubject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {SettingsService} from '../../services/admin-services/settings.service';
import {RubricsResponseInterface} from '../../interfaces/admin/settings/rubrics-response.interface';
import {SettingsBasicInterface} from '../../interfaces/admin/settings/settings-basic.interface';
import {SettingEditDialogComponent} from './setting-edit-dialog/setting-edit-dialog.component';
import {ConfirmDeleteDialogComponent} from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit, AfterViewInit {
  genresOpenState = false;
  collectionOpenState = false;
  formOpenState = false;
  typeOpenState = false;
  languageOpenState = false;
  publisherOpenState = false;

  public usersDisplayedColumns: string[] = ['firstName', 'lastName', 'personalNo', 'email', 'createDate'];
  usersRequest$ = new BehaviorSubject<boolean>(true);
  users$ = this.usersRequest$.pipe(switchMap(() => this.adminService.getAdminUsers()))
  usersDataSource = new MatTableDataSource<UsersResponseInterface>();

  public rubricDisplayedColumns: string[] = ['id', 'name', 'actions', 'delete'];
  rubricsRequest$ = new BehaviorSubject<boolean>(true);
  rubrics$ = this.rubricsRequest$.pipe(switchMap(() => this.settingsService.getAllGenres()))
  rubricsDataSource = new MatTableDataSource<SettingsBasicInterface>();
 // ფონდი / კოლექცია
  collectionsRequest$ = new BehaviorSubject<boolean>(true);
  collections$ = this.collectionsRequest$.pipe(switchMap(() => this.settingsService.getAllCollections()));
  collectionsDataSource = new MatTableDataSource<SettingsBasicInterface>();
// მასალის სახე
  formRequest$ = new BehaviorSubject<boolean>(true);
  forms$ = this.formRequest$.pipe(switchMap(() => this.settingsService.getAllForms()));
  formsDataSource = new MatTableDataSource<SettingsBasicInterface>();
// მასალის ტიპი
  typeRequest$ = new BehaviorSubject<boolean>(true);
  types$ = this.typeRequest$.pipe(switchMap(() => this.settingsService.getAllTypes()));
  typesDataSource = new MatTableDataSource<SettingsBasicInterface>();
// მასალის ენა
  languagesRequest$ = new BehaviorSubject<boolean>(true);
  languages$ = this.languagesRequest$.pipe(switchMap(() => this.settingsService.getAllLanguages()));
  languagesDataSource = new MatTableDataSource<SettingsBasicInterface>();
// გამომცემლობა
  publishersRequest$ = new BehaviorSubject<boolean>(true);
  publishers$ = this.publishersRequest$.pipe(switchMap(() => this.settingsService.getAllPublishers()));
  publishersDataSource = new MatTableDataSource<SettingsBasicInterface>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private adminService: AdminService,
              private settingsService: SettingsService,
              private toastr: ToastrService,
              public dialog: MatDialog)
  {
    this.subscribeToUsers();
    this.subscribeToRubrics();
    this.subscribeToCollections();
    this.subscribeToTypes();
    this.subscribeToForms();
    this.subscribeToLanguages();
    this.subscribeToPublishers();
  }

  private subscribeToForms(): void {
    this.forms$.subscribe(result => {
      if (result != null) {
        this.formsDataSource = new MatTableDataSource<SettingsBasicInterface>(result);
        this.formsDataSource.paginator = this.paginator;
      } else {
        this.toastr.error('არ გაქვს შესაბამისი უფლება');
      }
    })
  }

  private subscribeToTypes(): void {
    this.types$.subscribe(result => {
      if (result != null) {
        this.typesDataSource = new MatTableDataSource<SettingsBasicInterface>(result);
        this.typesDataSource.paginator = this.paginator;
      } else {
        this.toastr.error('არ გაქვს შესაბამისი უფლება');
      }
    })
  }

  private subscribeToLanguages(): void {
    this.languages$.subscribe(result => {
      if (result != null) {
        this.languagesDataSource = new MatTableDataSource<SettingsBasicInterface>(result);
        this.languagesDataSource.paginator = this.paginator;
      } else {
        this.toastr.error('არ გაქვს შესაბამისი უფლება');
      }
    })
  }

  private subscribeToPublishers(): void {
    this.publishers$.subscribe(result => {
      if (result != null) {
        this.publishersDataSource = new MatTableDataSource<SettingsBasicInterface>(result);
        this.publishersDataSource.paginator = this.paginator;
      } else {
        this.toastr.error('არ გაქვს შესაბამისი უფლება');
      }
    })
  }

  private subscribeToCollections(): void {
    this.collections$.subscribe(result => {
      if (result != null) {
        this.collectionsDataSource = new MatTableDataSource<SettingsBasicInterface>(result);
        this.collectionsDataSource.paginator = this.paginator;
      } else {
        this.toastr.error('არ გაქვს შესაბამისი უფლება');
      }
    })
  }

  private subscribeToRubrics(): void {
    this.rubrics$.subscribe(result => {
      if (result != null) {
        this.rubricsDataSource = new MatTableDataSource<SettingsBasicInterface>(result);
        this.rubricsDataSource.paginator = this.paginator;
      } else {
        this.toastr.error('არ გაქვს შესაბამისი უფლება');
      }
    })
  }

  private subscribeToUsers(): void {
    this.users$.subscribe(result => {
      if (result != null) {
        this.usersDataSource = new MatTableDataSource<UsersResponseInterface>(result);
        this.usersDataSource.paginator = this.paginator;
      } else {
        this.toastr.error('არ გაქვს შესაბამისი უფლება');
      }
    })
  }

  public editRubric(rubric: SettingsBasicInterface) {
    this.genresOpenState = !this.genresOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: rubric
    }).afterClosed().subscribe(result => {
      if (result) {
        this.updateRubric(result);
      }
      console.log(result);
    })
  }

  public addRubric(): void {
    this.genresOpenState = !this.genresOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: null
    }).afterClosed().subscribe(result => {
      if (result) {
        this.createRubric(result);
      }
    })
  }

  public deleteRubric(rubric: SettingsBasicInterface): void {
    this.genresOpenState = !this.genresOpenState
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteRubricServ(rubric);
      }
    })
  }

  // ფონდი / კოლექცია

  public addCollection(): void {
    this.collectionOpenState = !this.collectionOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: null
    }).afterClosed().subscribe(result => {
      if (result) {
        this.addCollectionServ(result);
      }
    })
  }

  public editCollection(collection: SettingsBasicInterface): void {
    this.collectionOpenState = !this.collectionOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: collection
    }).afterClosed().subscribe(result => {
      if (result) {
        this.updateCollectionServ(result);
      }
    })
  }

  public deleteCollection(collection: SettingsBasicInterface): void {
    this.collectionOpenState = !this.collectionOpenState
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteCollectionServ(collection);
      }
    })
  }

  // მასალის სახე

  public addForm(): void {
    this.formOpenState = !this.formOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: null
    }).afterClosed().subscribe(result => {
      if (result) {
        this.addFormServ(result);
      }
    })
  }

  public editForm(form: SettingsBasicInterface): void {
    this.formOpenState = !this.formOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: form
    }).afterClosed().subscribe(result => {
      if (result) {
        this.updateFormServ(result);
      }
    })
  }

  public deleteForm(form: SettingsBasicInterface): void {
    this.formOpenState = !this.formOpenState
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteFormServ(form);
      }
    })
  }


  // მასალის ტიპი
  public addType(): void {
    this.typeOpenState = !this.typeOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: null
    }).afterClosed().subscribe(result => {
      if (result) {
        this.addTypeServ(result);
      }
    })
  }

  public editType(type: SettingsBasicInterface): void {
    this.typeOpenState = !this.typeOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: type
    }).afterClosed().subscribe(result => {
      if (result) {
        this.updateTypeServ(result);
      }
    })
  }

  public deleteType(type: SettingsBasicInterface): void {
    this.typeOpenState = !this.typeOpenState
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteTypeServ(type);
      }
    })
  }

  // მასალის ენა
  public addLanguage(): void {
    this.languageOpenState = !this.languageOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: null
    }).afterClosed().subscribe(result => {
      if (result) {
        this.addLanguageServ(result);
      }
    })
  }

  public editLanguage(language: SettingsBasicInterface): void {
    this.languageOpenState = !this.languageOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: language
    }).afterClosed().subscribe(result => {
      if (result) {
        this.updateLanguageServ(result);
      }
    })
  }

  public deleteLanguage(language: SettingsBasicInterface): void {
    this.languageOpenState = !this.languageOpenState
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteLanguageServ(language);
      }
    })
  }

  //გამომცემლობა
  public addPublisher(): void {
    this.publisherOpenState = !this.publisherOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: null
    }).afterClosed().subscribe(result => {
      if (result) {
        this.addPublisherServ(result);
      }
    })
  }

  public editPublisher(publisher: SettingsBasicInterface): void {
    this.publisherOpenState = !this.publisherOpenState
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: publisher
    }).afterClosed().subscribe(result => {
      if (result) {
        this.updatePublisherServ(result);
      }
    })
  }

  public deletePublisher(publisher: SettingsBasicInterface): void {
    this.publisherOpenState = !this.publisherOpenState
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deletePublisherServ(publisher);
      }
    })
  }


  public createNewUser() {
    this.dialog.open(CreateAdminDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.createAdminUser(result);
      }
    }, error => {
      console.log(error);
    });
  }
// ფონდი / კოლექცია
  private addCollectionServ(collection: SettingsBasicInterface): void {
    this.settingsService.createCollection(collection).subscribe(result => {
      if (result == null) {
        this.toastr.error('ფონდი/კოლექცია ვერ დაემატა');
      } else {
        this.collectionsRequest$.next(true);
        this.toastr.success('ფონდი/კოლექცია წარმატებით დაემატა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private updateCollectionServ(collection: SettingsBasicInterface): void {
    this.settingsService.updateCollection(collection).subscribe(result => {
      if (result == null) {
        this.toastr.error('ფონდი/კოლექცია ვერ განახლდა');
      } else {
        this.collectionsRequest$.next(true);
        this.toastr.success('ფონდი/კოლექცია წარმატებით განახლდა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private deleteCollectionServ(collection: SettingsBasicInterface): void {
    this.settingsService.deleteCollection(collection).subscribe(result => {
      this.collectionsRequest$.next(true);
      this.toastr.success('ფონდი/კოლექცია წარმატებით წაიშალა');
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }
// მასალის სახე
  private addFormServ(form: SettingsBasicInterface): void {
    this.settingsService.createForms(form).subscribe(result => {
      if (result == null) {
        this.toastr.error('მასალის სახე ვერ დაემატა');
      } else {
        this.formRequest$.next(true);
        this.toastr.success('მასალის სახე წარმატებით დაემატა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private updateFormServ(form: SettingsBasicInterface): void {
    this.settingsService.updateForm(form).subscribe(result => {
      if (result == null) {
        this.toastr.error('მასალის სახე ვერ განახლდა');
      } else {
        this.formRequest$.next(true);
        this.toastr.success('მასალის სახე წარმატებით განახლდა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private deleteFormServ(form: SettingsBasicInterface): void {
    this.settingsService.deleteForm(form).subscribe(result => {
      this.formRequest$.next(true);
      this.toastr.success('მასალის სახე წარმატებით წაიშალა');
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  // მასალის ტიპი
  private addTypeServ(type: SettingsBasicInterface): void {
    this.settingsService.createTypes(type).subscribe(result => {
      if (result == null) {
        this.toastr.error('მასალის ტიპი ვერ დაემატა');
      } else {
        this.typeRequest$.next(true);
        this.toastr.success('მასალის ტიპი წარმატებით დაემატა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private updateTypeServ(type: SettingsBasicInterface): void {
    this.settingsService.updateType(type).subscribe(result => {
      if (result == null) {
        this.toastr.error('მასალის ტიპი ვერ განახლდა');
      } else {
        this.typeRequest$.next(true);
        this.toastr.success('მასალის ტიპი წარმატებით განახლდა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private deleteTypeServ(type: SettingsBasicInterface): void {
    this.settingsService.deleteType(type).subscribe(result => {
      this.typeRequest$.next(true);
      this.toastr.success('მასალის ტიპი წარმატებით წაიშალა');
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  // მასალის ენა
  private addLanguageServ(language: SettingsBasicInterface): void {
    this.settingsService.createLanguage(language).subscribe(result => {
      if (result == null) {
        this.toastr.error('მასალის ენა ვერ დაემატა');
      } else {
        this.languagesRequest$.next(true);
        this.toastr.success('მასალის ენა წარმატებით დაემატა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private updateLanguageServ(language: SettingsBasicInterface): void {
    this.settingsService.updateLanguage(language).subscribe(result => {
      if (result == null) {
        this.toastr.error('მასალის ენა ვერ განახლდა');
      } else {
        this.languagesRequest$.next(true);
        this.toastr.success('მასალის ენა წარმატებით განახლდა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private deleteLanguageServ(language: SettingsBasicInterface): void {
    this.settingsService.deleteLanguage(language).subscribe(result => {
      this.languagesRequest$.next(true);
      this.toastr.success('მასალის ენა წარმატებით წაიშალა');
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  // გამომცემლობა
  private addPublisherServ(publisher: SettingsBasicInterface): void {
    this.settingsService.createPublisher(publisher).subscribe(result => {
      if (result == null) {
          this.toastr.error('გამომცემლობა ვერ დაემატა');
      } else {
        this.publishersRequest$.next(true);
        this.toastr.success('გამომცემლობა წარმატებით დაემატა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private updatePublisherServ(publisher: SettingsBasicInterface): void {
    this.settingsService.updatePublisher(publisher).subscribe(result => {
      if (result == null) {
        this.toastr.error('გამომცემლობა ვერ განახლდა');
      } else {
        this.publishersRequest$.next(true);
        this.toastr.success('გამომცემლობა წარმატებით განახლდა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private deletePublisherServ(publisher: SettingsBasicInterface): void {
    this.settingsService.deletePublisher(publisher  ).subscribe(result => {
      this.publishersRequest$.next(true);
      this.toastr.success('გამომცემლობა წარმატებით წაიშალა');
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private createRubric(rubric: SettingsBasicInterface): void {
    this.settingsService.createGenre(rubric).subscribe(result => {
      if (result == null) {
        this.toastr.error('რუბრიკა ვერ დაემატა');
      } else {
        this.rubricsRequest$.next(true);
        this.toastr.success('რუბრიკა წარმატებით დაემატა');
    }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private deleteRubricServ(rubric: SettingsBasicInterface): void {
    this.settingsService.deleteGenre(rubric).subscribe(result => {
      this.rubricsRequest$.next(true);
      this.toastr.success('რუბრუკა წარმატებით წაიშალა');
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private updateRubric(rubric: SettingsBasicInterface): void {
    this.settingsService.updateGenre(rubric).subscribe(result => {
      if (result == null) {
        this.toastr.error('რუბრიკა ვერ განახლდა');
      } else {
        this.rubricsRequest$.next(true);
        this.toastr.success('რუბრუკა წარმატებით განახლდა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  private createAdminUser(newUser: CreateAdminInterface): void {
    this.adminService.createAdmin(newUser).subscribe(result => {
      if (result == null) {
        this.toastr.error('მომხმარებელი ვერ დაემატა');
      } else {
        this.usersRequest$.next(true);
        this.toastr.success('მომხმარებელი წარმატებით დაემატა');
      }
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

  ngAfterViewInit() {
    this.usersDataSource.paginator = this.paginator;
    this.rubricsDataSource.paginator = this.paginator;
    this.collectionsDataSource.paginator = this.paginator;
    this.formsDataSource.paginator = this.paginator;
    this.typesDataSource.paginator = this.paginator;
    this.languagesDataSource.paginator = this.paginator;
    this.publishersDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
  }

}
