import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserResponseInterface} from '../../../interfaces/login/google-user-response.interface';
import {LoginService} from '../../../services/login-services/login.service';
import {AdminService} from '../../../services/admin-services/admin.service';
import {ToastrService} from 'ngx-toastr';
import {UsersResponseInterface} from '../../../interfaces/admin/users-response.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SettingsBasicInterface} from '../../../interfaces/admin/settings/settings-basic.interface';
import {BookCopyInterface} from '../../../interfaces/admin/main-page/books.interface';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss']
})
export class BookingPageComponent implements OnInit {

  bookingForm: FormGroup;

  createDateFrom = new FormControl(null, [Validators.required]);
  createDateTo = new FormControl(null, [Validators.required]);
  reader = new FormControl(null, [Validators.required]);
  personalNo = new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")]);
  readerObj = new FormControl(null);

  readers: UsersResponseInterface[] = [];

  //readerObj: UsersResponseInterface = null;

  constructor(private fb: FormBuilder, private adminService: AdminService, private toastr: ToastrService,
              @Inject(MAT_DIALOG_DATA) public data: BookCopyInterface,
              private matDialogRef: MatDialogRef<any>) {
    if (this.data == null) {
      matDialogRef.close();
    } else {
      this.bookingForm = this.fb.group({
        createDateFrom: this.createDateFrom,
        createDateTo: this.createDateTo,
        reader: this.reader,
        personalNo: this.personalNo,
        readersObj: this.readerObj
      })
    }
  }

  onSubmit(): void {
    if (!this.bookingForm.valid || this.readerObj.value == null) {
      this.toastr.error('არავალიდური ინფორმაცია');
      return;
    }
    this.matDialogRef.close(this.bookingForm.value);
  }

  findReaderByPersonalNum(): void {
    this.adminService.getUsers(false, this.personalNo.value).subscribe(result => {
      if (result['content'].length == 1) {
        this.readerObj.setValue(result['content'][0])
        this.reader.setValue(this.readerObj['firstName'] + ' ' + this.readerObj['lastName']);
      } else {
        this.readerObj.setValue(null);
        this.reader.setValue(null);
        this.toastr.error('დაფიქსირდა შეცდომა');
      }
    })
  }

  ngOnInit(): void {
    this.adminService.getUsers(false).subscribe(result => {
      this.readers = result['content'];
    }, error => {
      this.toastr.error('დაფიქსირდა შეცდომა');
    })
  }

}
