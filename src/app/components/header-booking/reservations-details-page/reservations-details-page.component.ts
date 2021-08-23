import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReservationsInterface} from '../../../interfaces/admin/booking/reservations.interface';
import {UserResponseInterface} from '../../../interfaces/admin/user/user-response.interface';
import {UsersService} from '../../../services/users/users.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-reservations-details-page',
  templateUrl: './reservations-details-page.component.html',
  styleUrls: ['./reservations-details-page.component.scss']
})
export class ReservationsDetailsPageComponent implements OnInit {
  public userData: UserResponseInterface
  public lendererUserData: UserResponseInterface
  public confirmerUserData: UserResponseInterface

  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: ReservationsInterface,
              private userService: UsersService, private toastr: ToastrService) {
    console.log(data);
    this.userService.getUserInfo(data.userId).subscribe(result => {
      this.userData = result;
      console.log(result);
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
    if (data.confirmerAdminId) {
      this.userService.getUserInfo(data.confirmerAdminId).subscribe(result => {
        this.confirmerUserData = result;
        console.log(this.confirmerUserData);
      }, error => {
        this.toastr.error('დაფიქსირდა შეცდომა');
      })
    }
    if (data.lenderAdminId) {
      this.userService.getUserInfo(data.lenderAdminId).subscribe(result => {
        this.lendererUserData = result;
      }, error => {
        this.toastr.error('დაფიქსირდა შეცდომა');
      })
    }
  }

  ngOnInit(): void {

  }

}
