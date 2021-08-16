import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {ReservationsService} from '../../services/admin-services/reservations.service';
import {UsersResponseInterface} from '../../interfaces/admin/users-response.interface';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {CreateAdminDialogComponent} from '../admin-page/create-admin-dialog/create-admin-dialog.component';
import {SettingEditDialogComponent} from '../admin-page/setting-edit-dialog/setting-edit-dialog.component';
import {SettingsBasicInterface} from '../../interfaces/admin/settings/settings-basic.interface';
import {UsersService} from '../../services/users/users.service';
import {CreateAdminInterface} from '../../interfaces/admin/create-admin.interface';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit, AfterViewInit {
  public userInfo: any = {};
  private userId = localStorage.getItem('id');

  public reservationDisplayedColumns: string[] = ['bookTitle', 'author', 'bookCopyCode', 'startDate', 'endDate', 'status', 'actions'];
  reservationsRequest$ = new BehaviorSubject<boolean>(true);
  reservations$ = this.reservationsRequest$.pipe(switchMap(() => this.reservationService.getUserReservations(+this.userId)))
  reservationDataSource = new MatTableDataSource<any>();

  @ViewChild('reservationPagination', {static: true}) reservationPagination: MatPaginator;

  constructor(private reservationService: ReservationsService, private dialog: MatDialog,
              public userService: UsersService) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.userInfo['personalNo'] = localStorage.getItem('personalNo');
    this.userInfo['phoneNum'] = localStorage.getItem('phoneNum');
    console.log(this.userInfo);
    this.subscribeToReservations()
  }

  public onCancelClick(element: any): void {
    console.log("cancel", element);
  }

  public phoneNumEdit(): void {
    let phoneInfo: SettingsBasicInterface = {
      name: this.userInfo['phoneNum']
    }
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: phoneInfo
    }).afterClosed().subscribe(result => {
      if (result) {
        this.phoneNumEditServ(result.name);
        // this.userInfo['phoneNum'] = result.name
        // localStorage.setItem('phoneNum', result.name)
      }
    })
  }

  phoneNumEditServ(phoneNum: string): void {
    let userId = localStorage.getItem('id');
    if (userId) {
      let user: CreateAdminInterface = {
        id: +userId,
        phoneNumber: phoneNum,
        firstName: this.userInfo.firstName,
        lastName: this.userInfo.lastName,
        email: this.userInfo.email,
        personalNo: localStorage.getItem('personalNo')
      }
      console.log(user);
      this.userService.editUserPhone(+userId, user).subscribe(result => {
        console.log(result);
      }, error => {
        console.log(error);
      })
    }
  }



  private subscribeToReservations(): void {
    this.reservationService.getUserReservations(+this.userId).subscribe(result => {
      if (result != null) {
        console.log(result);
        this.reservationDataSource = new MatTableDataSource<any>(result);
        this.reservationDataSource.paginator = this.reservationPagination;
      }
    })

  }

  ngAfterViewInit(): void {
    this.reservationDataSource.paginator = this.reservationPagination;
  }

}
