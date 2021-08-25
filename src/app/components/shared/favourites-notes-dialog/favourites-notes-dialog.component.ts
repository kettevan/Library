import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-favourites-notes-dialog',
  templateUrl: './favourites-notes-dialog.component.html',
  styleUrls: ['./favourites-notes-dialog.component.scss']
})
export class FavouritesNotesDialogComponent implements OnInit {

  favouriteNoteForm: FormGroup;
  note = new FormControl('');

  constructor(private matDialogRef: MatDialogRef<string>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.favouriteNoteForm = this.fb.group({
      note: this.note
    });
  }

  onCancelClick(): void {
    this.matDialogRef.close();
  }

  onSubmitClick(): void {
    if (this.note.value) {
      this.matDialogRef.close(this.note.value);
    } else {
      this.matDialogRef.close('');
    }
  }

}
