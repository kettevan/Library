import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css']
})
export class ConfirmDeleteDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<boolean>) {}

  ngOnInit() {}

  onConfirmClick() {
    this.dialogRef.close(true);
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }

}
