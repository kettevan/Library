import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {ReservationsService} from '../../services/admin-services/reservations.service';
import {UsersResponseInterface} from '../../interfaces/admin/users-response.interface';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  public userInfo: any = {};
  private userId = localStorage.getItem('id');

  public reservationDisplayedColumns: string[] = ['firstName', 'lastName', 'personalNo', 'email', 'createDate'];
  reservationsRequest$ = new BehaviorSubject<boolean>(true);
  reservations$ = this.reservationsRequest$.pipe(switchMap(() => this.reservationService.getUserReservations(+this.userId)))
  reservationDataSource = new MatTableDataSource<any>();

  constructor(private reservationService: ReservationsService) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    this.userInfo['personalNo'] = localStorage.getItem('personalNo');
    this.userInfo['phoneNum'] = localStorage.getItem('phoneNum');
    console.log(this.userInfo);
    this.subscribeToReservations()
  }

  private subscribeToReservations(): void {
    this.reservationService.getUserReservations(+this.userId).subscribe(result => {
      if (result != null) {
        console.log(result);
        this.reservationDataSource = new MatTableDataSource<any>(result);
      }
    })

  }

}
