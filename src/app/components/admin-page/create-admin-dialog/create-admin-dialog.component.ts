import {Component, Inject, Injectable, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {SettingsBasicInterface} from '../../../interfaces/admin/settings/settings-basic.interface';
import {UsersResponseInterface} from '../../../interfaces/admin/users-response.interface';

@Component({
  selector: 'app-create-admin-dialog',
  templateUrl: './create-admin-dialog.component.html',
  styleUrls: ['./create-admin-dialog.component.scss']
})
export class CreateAdminDialogComponent implements OnInit {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();


  createUserForm: FormGroup;
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', Validators.required);
  personalNo = new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl(null);
  readerType = new FormControl(null);
  password = new FormControl(null);
  repeatPassword = new FormControl(null);

  public hidePassword: boolean = true;
  public hideRepPassword: boolean = true;

  constructor(private fb: FormBuilder, private matDialogRef: MatDialogRef<any>, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public isAdmin: boolean) {
    this.createUserForm = fb.group( {
      firstName: this.firstName,
      lastName: this.lastName,
      personalNo: this.personalNo,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      repeatPassword: this.repeatPassword,
      readerType: this.readerType
    });
    if (isAdmin) {
      this.password.setValidators(Validators.required);
      this.repeatPassword.setValidators(Validators.required);
    } else {
      this.readerType.setValidators(Validators.required);
    }

  }


  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.createUserForm.valid) {
      return;
    }
    if (this.createUserForm.controls['password'].value != this.createUserForm.controls['repeatPassword'].value) {
      this.toastr.error("პაროლები არ ემთხვევა");
      return;
    }
    if (!this.createUserForm.controls['email'].value.includes('freeuni.edu.ge')) {
      this.toastr.error('დარეგისტრირება შესაძლებელია მხოლოდ freeuni-ის მეილით');
      return;
    }
    const rawValue = this.createUserForm.getRawValue();
    this.matDialogRef.close(rawValue);
  }



}
