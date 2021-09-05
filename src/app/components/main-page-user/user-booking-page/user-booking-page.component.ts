import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BooksInterface} from '../../../interfaces/admin/books/books.interface';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-booking-page',
  templateUrl: './user-booking-page.component.html',
  styleUrls: ['./user-booking-page.component.scss']
})
export class UserBookingPageComponent implements OnInit {

  public minDate: Date = new Date();
  public maxDate: Date = new Date();
  public disabledDatesArr = [];

  public selectedBookCopy = null;

  bookCopy = new FormControl(null, [Validators.required]);
  startDate = new FormControl(null,[Validators.required]);
  endDate = new FormControl(null,[Validators.required]);

  public userBookingForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: BooksInterface,
              public toastr: ToastrService, private fb: FormBuilder) {
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
    this.userBookingForm = this.fb.group({
      bookCopy: this.bookCopy,
      startDate: this.startDate,
      endDate: this.endDate
    })
  }

  dateFilter = (d: Date): boolean => {
    const index = this.disabledDatesArr.indexOf(d.getTime())
    return index === -1;
  }

  disableDates(): void {
    this.selectedBookCopy = this.bookCopy.value;
    this.startDate.setValue(null);
    this.endDate.setValue(null);
    if (this.bookCopy.value.bookedDates) {
      this.disabledDatesArr = this.bookCopy.value.bookedDates;
      this.disabledDatesArr = this.disabledDatesArr.map(x => {
        return new Date(x).getTime();
      })
    } else {
      this.disabledDatesArr = [];
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(): void {
    this.dialogRef.close(this.userBookingForm.getRawValue());
  }

  ngOnInit(): void {
    if (this.data === null) {
      this.dialogRef.close();
      this.toastr.error('დაფიქსირდა შეცდომა');
    }
  }

}
