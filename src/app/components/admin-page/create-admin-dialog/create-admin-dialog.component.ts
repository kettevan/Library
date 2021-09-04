import {Component, Inject, Injectable, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {SettingsBasicInterface} from '../../../interfaces/admin/settings/settings-basic.interface';
import {UsersResponseInterface} from '../../../interfaces/admin/users-response.interface';
import {UserEditInterface} from '../../../interfaces/admin/user/user-edit.interface';

@Component({
  selector: 'app-create-admin-dialog',
  templateUrl: './create-admin-dialog.component.html',
  styleUrls: ['./create-admin-dialog.component.scss']
})
export class CreateAdminDialogComponent implements OnInit {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();


  createUserForm: FormGroup;
  id = new FormControl(null);
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', Validators.required);
  personalNo = new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl(null);
  userType = new FormControl(null);
  password = new FormControl(null);
  repeatPassword = new FormControl(null);
  isAdmin = new FormControl(false);

  public hidePassword: boolean = true;
  public hideRepPassword: boolean = true;

  constructor(private fb: FormBuilder, private matDialogRef: MatDialogRef<any>, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public info: UserEditInterface) {
    this.createUserForm = fb.group( {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      personalNo: this.personalNo,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      repeatPassword: this.repeatPassword,
      userType: this.userType,
      isAdmin: this.isAdmin
    });
    console.log(info.userInfo);
    if (info.userInfo) {
      this.id.setValue(this.info.userInfo.id);
      this.firstName.setValue(this.info.userInfo.firstName);
      this.lastName.setValue(this.info.userInfo.lastName);
      this.personalNo.setValue(this.info.userInfo.personalNo);
      this.email.setValue(this.info.userInfo.email);
      this.phoneNumber.setValue(this.info.userInfo.phoneNumber);
      this.isAdmin.setValue(true);
      if (!this.info.isAdmin) {
        this.userType.setValue(this.info.userInfo.userType);
      }
    }
    if (info.isAdmin && info.userInfo === null) {
      this.isAdmin.setValue(true);
      this.password.setValidators(Validators.required);
      this.repeatPassword.setValidators(Validators.required);
    } else if (!info.isAdmin){
      this.isAdmin.setValue(false);
      this.userType.setValidators(Validators.required);
    }
  }


  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.createUserForm.valid) {
      this.toastr.error('მონაცემები არასწორია/არასაკმარია');
      return;
    }
    if (this.info.isAdmin && this.info.userInfo !== null && (this.createUserForm.controls['password'].value != this.createUserForm.controls['repeatPassword'].value)) {
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
