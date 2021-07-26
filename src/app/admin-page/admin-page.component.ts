import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../services/admin-services/admin.service';
import {MatTableDataSource} from '@angular/material/table';
import {UsersResponseInterface} from '../interfaces/admin/users-response.interface';
import {MatPaginator} from '@angular/material/paginator';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {CreateAdminDialogComponent} from './create-admin-dialog/create-admin-dialog.component';
import {CreateAdminInterface} from '../interfaces/admin/create-admin.interface';
import {BehaviorSubject} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['firstName', 'lastName', 'personalNo', 'email', 'createDate'];
  usersRequest$ = new BehaviorSubject<boolean>(true);
  users$ = this.usersRequest$.pipe(switchMap(() => this.adminService.getAdminUsers()))
  dataSource = new MatTableDataSource<UsersResponseInterface>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private adminService: AdminService,
              private toastr: ToastrService,
              public dialog: MatDialog)
  {
    this.users$.subscribe(result => {
      if (result != null) {
        this.dataSource = new MatTableDataSource<UsersResponseInterface>(result);
        this.dataSource.paginator = this.paginator;
      } else {
        this.toastr.error('არ გაქვს შესაბამისი უფლება');
      }
    })
    // adminService.getAdminUsers().subscribe(result => {
    //   if (result != null) {
    //     this.dataSource = new MatTableDataSource<UsersResponseInterface>(result);
    //     this.dataSource.paginator = this.paginator;
    //   } else {
    //     this.toastr.error('არ გაქვს შესაბამისი უფლება');
    //   }
    // }, error => {
    //   this.toastr.error('დაფიქსირდა შეცდომა');
    // })
  }

  createNewUser() {
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

  createAdminUser(newUser: CreateAdminInterface): void {
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
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
  }

}
