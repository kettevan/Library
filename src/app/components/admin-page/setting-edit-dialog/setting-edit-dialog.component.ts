import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SettingsBasicInterface} from '../../../interfaces/admin/settings/settings-basic.interface';
import {ToastrService} from 'ngx-toastr';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-setting-edit-dialog',
  templateUrl: './setting-edit-dialog.component.html',
  styleUrls: ['./setting-edit-dialog.component.scss']
})
export class SettingEditDialogComponent implements OnInit {

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  settingForm: FormGroup;
  name = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder, private toastr: ToastrService, private matDialogRef: MatDialogRef<SettingsBasicInterface>,
              @Inject(MAT_DIALOG_DATA) public data: SettingsBasicInterface) {
    this.settingForm = this.fb.group( {
      name: this.name
    });
    if (this.data !== null && this.data.name !== undefined) {
      this.name.setValue( this.data.name);
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.settingForm.valid) {
      this.toastr.error('არავალიდური ინფორმაცია');
    } else if (this.data == null) {
      const result: SettingsBasicInterface = {
        name: this.name.value
      };
      this.matDialogRef.close(result);
    } else {
      this.data.name = this.name.value
      this.save.emit(this.data);
      this.matDialogRef.close(this.data);
    }
  }

}
