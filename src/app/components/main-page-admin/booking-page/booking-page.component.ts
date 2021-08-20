import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../../services/admin-services/admin.service';
import {ToastrService} from 'ngx-toastr';
import {UsersResponseInterface} from '../../../interfaces/admin/users-response.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BookCopyInterface} from '../../../interfaces/admin/books/books.interface';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss']
})
export class BookingPageComponent implements OnInit {

  bookingForm: FormGroup;

  dateFrom = new FormControl(null, [Validators.required]);
  dateTo = new FormControl(null, [Validators.required]);
  reader = new FormControl(null, [Validators.required]);
  personalNo = new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")]);
  readerObj = new FormControl(null);
  public minDate: Date = new Date();
  public maxDate: Date = new Date();

  public disabledDatesArr = [];

  constructor(private fb: FormBuilder, private adminService: AdminService, private toastr: ToastrService,
              @Inject(MAT_DIALOG_DATA) public data: BookCopyInterface,
              private matDialogRef: MatDialogRef<any>) {
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
    if (this.data == null) {
      matDialogRef.close();
    } else {
      data.bookedDates?.forEach(bookedDate => {
        let date = new Date(bookedDate);
        this.disabledDatesArr.push(date.getTime())
      })
      this.bookingForm = this.fb.group({
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        reader: this.reader,
        personalNo: this.personalNo,
        readersObj: this.readerObj
      })
    }
  }

  dateFilter = (d: Date): boolean => {
    const index = this.disabledDatesArr.indexOf(d.getTime())
    return index === -1;
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
        this.reader.setValue(this.readerObj.value.firstName + ' ' + this.readerObj.value.lastName);
      } else {
        this.readerObj.setValue(null);
        this.reader.setValue(null);
        this.toastr.error('დაფიქსირდა შეცდომა');
      }
    })
  }

  ngOnInit(): void {
  }

}
