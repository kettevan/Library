import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-reservation-conformation-dialog',
  templateUrl: './reservation-conformation-dialog.component.html',
  styleUrls: ['./reservation-conformation-dialog.component.scss']
})
export class ReservationConformationDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<boolean>, @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  onConfirmClick() {
    this.dialogRef.close(true);
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }

}
