import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminApiService} from '../../admin-api.service';

@Component({
  selector: 'app-appl',
  templateUrl: './appl.component.html',
  styleUrls: ['./appl.component.css']
})
export class ApplComponent implements OnInit {

  applForm: FormGroup;
  // roles: any[];

  constructor(public dialogRef: MatDialogRef<ApplComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public adminApiService: AdminApiService) {

    this.applForm = fb.group({
      'firstname': ['', [Validators.required]],
      'lastname': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'code': ['', [Validators.required, Validators.minLength(1)]],
      'phone': ['', [Validators.required, Validators.minLength(10)]],
      'email': ['', null]
    });
  }

  ngOnInit() {
/*    this.roles = [
      {
        role: 'admin'
      },
      {
        role: 'operations'
      },
      {
        role: 'finance'
      }
    ];*/
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(emp: any): void {
    console.log('onSubmit', emp);
    this.dialogRef.close(emp);
  }

}
