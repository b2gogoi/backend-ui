import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminApiService} from '../../admin-api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  empForm: FormGroup;
  roles: any[];

  constructor(public dialogRef: MatDialogRef<UserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public adminApiService: AdminApiService) {

    this.empForm = fb.group({
      'username': ['', [Validators.required]],
      'name': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'role': ['', [Validators.required]],
      'email': ['', null]
    });
  }

  ngOnInit() {
    this.roles = [
      {
        role: 'admin'
      },
      {
        role: 'operations'
      },
      {
        role: 'finance'
      }
    ];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(emp: any): void {
    console.log('onSubmit', emp);
    this.dialogRef.close(emp);
  }

}
