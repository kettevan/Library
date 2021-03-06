import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {ReservationsService} from '../../services/admin-services/reservations.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {SettingEditDialogComponent} from '../admin-page/setting-edit-dialog/setting-edit-dialog.component';
import {SettingsBasicInterface} from '../../interfaces/admin/settings/settings-basic.interface';
import {UsersService} from '../../services/users/users.service';
import {UserResponseInterface} from '../../interfaces/admin/user/user-response.interface';
import {ToastrService} from 'ngx-toastr';
import {ConfirmDeleteDialogComponent} from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import {FavouriteInterface} from '../../interfaces/admin/user/favourite.interface';
import {Router} from '@angular/router';
import {SocialAuthService} from 'angularx-social-login';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit, AfterViewInit {
  public userInfo: UserResponseInterface;
  private userId = +localStorage.getItem('id');

  public reservationDisplayedColumns: string[] = ['bookTitle', 'author', 'bookCopyCode', 'startDate', 'endDate', 'status', 'actions'];
  reservationsRequest$ = new BehaviorSubject<boolean>(true);
  reservations$ = this.reservationsRequest$.pipe(switchMap(() => this.reservationService.getUserReservations(+this.userId)))
  reservationDataSource = new MatTableDataSource<any>();

  public favouritesDisplayedColumns: string[] = ['bookTitle', 'author', 'note', 'actions'];
  favouritesRequest$ = new BehaviorSubject<boolean>(true);
  favourites$ = this.favouritesRequest$.pipe(switchMap(() => this.userService.favouritesByUser(+this.userId)))
  favouritesDataSource = new MatTableDataSource<any>();

  @ViewChild('reservationPagination') reservationPagination: MatPaginator;
  @ViewChild('favouritesPagination') favouritesPagination: MatPaginator;

  public photoUrl: string = null;


  constructor(private reservationService: ReservationsService, private dialog: MatDialog,
              public userService: UsersService, private toastr: ToastrService, private router: Router,  public socialAuthServive: SocialAuthService) {
    this.socialAuthServive.authState.subscribe(result => {
      if (result) {
        this.photoUrl = result.photoUrl;
      }
    })
  }

  ngOnInit(): void {
    this.userService.getUserInfo(this.userId).subscribe(result => {
      this.userInfo = result;
      this.userInfo.authorities = null;
    })
    this.subscribeToReservations();
    this.subscribeToFavourites();

  }

  public viewFavBooksDetails(element: FavouriteInterface): void {
    this.router.navigate([`book/view/${element.bookId}`]);
  }

  public deleteFromFavourite(element: FavouriteInterface): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.deleteFromFavouriteServ(element.id);
      }
    })
  }

  private deleteFromFavouriteServ(favouriteId: number): void {
    this.userService.deleteFromFavourite(favouriteId).subscribe(result => {
      this.favouritesRequest$.next(true);
      this.toastr.success('?????????????????????????????? ?????????????????????');
    }, error => {
      this.toastr.error('?????????????????????????????? ?????????????????????');
    })
  }


  private subscribeToFavourites(): void {
    this.favourites$.subscribe(result => {
      if (result != null) {
        console.log(result);
        this.favouritesDataSource = new MatTableDataSource<any>(result);
        this.favouritesDataSource.paginator = this.favouritesPagination;
      }
    })
  }

  public onCancelClick(element: any): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.cancelReservationServ(element);
      }
    })
  }

  private cancelReservationServ(element: any): void {
    this.reservationService.cancelReservation(element.id).subscribe(result => {
      this.reservationsRequest$.next(true);
      this.toastr.success('????????????????????? ?????????????????????????????? ?????????????????????');
    }, error => {
      this.toastr.error('?????????????????????????????? ?????????????????????');
    })
  }

  public phoneNumEdit(): void {
    let phoneInfo: SettingsBasicInterface = {
      name: this.userInfo.phoneNumber
    }
    this.dialog.open(SettingEditDialogComponent, {
      width: '400px',
      data: phoneInfo
    }).afterClosed().subscribe(result => {
      if (result) {
        this.phoneNumEditServ(result.name);
      }
    })
  }

  phoneNumEditServ(phoneNum: string): void {
    this.userInfo.phoneNumber = phoneNum;
      this.userService.editUserPhone(this.userId, this.userInfo).subscribe(res => {
        if (res) {
          this.toastr.success('?????????????????? ?????????????????????????????? ????????????????????????');
        }
      }, error => {
        this.toastr.error('?????????????????????????????? ?????????????????????');
      })
  }



  private subscribeToReservations(): void {
    this.reservations$.subscribe(result => {
      if (result != null) {
        console.log(result);
        this.reservationDataSource = new MatTableDataSource<any>(result);
        this.reservationDataSource.paginator = this.reservationPagination;
      }
    })

  }

  ngAfterViewInit(): void {
    this.reservationDataSource.paginator = this.reservationPagination;
    this.favouritesDataSource.paginator = this.favouritesPagination;
  }

}
