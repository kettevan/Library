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

  public usersDisplayedColumns: string[] = ['firstName', 'lastName', 'personalNo', 'email', 'createDate'];
  usersRequest$ = new BehaviorSubject<boolean>(true);
  users$ = this.usersRequest$.pipe(switchMap(() => this.adminService.getAdminUsers()))
  usersDataSource = new MatTableDataSource<UsersResponseInterface>();

  public rubricDisplayedColumns: string[] = ['id', 'name', 'actions', 'delete'];
  rubricsRequest$ = new BehaviorSubject<boolean>(true);
  rubrics$ = this.rubricsRequest$.pipe(switchMap(() => this.settingsService.getAllGenres()))
  rubricsDataSource = new MatTableDataSource<SettingsBasicInterface>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private adminService: AdminService,
              private settingsService: SettingsService,
              private toastr: ToastrService,
              public dialog: MatDialog)
  {
    this.subscribeToUsers();
    this.subscribeToRubrics();
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
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteRubricServ(rubric);
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
  }

  ngOnInit(): void {
  }

}
