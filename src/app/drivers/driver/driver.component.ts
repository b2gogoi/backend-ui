import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Driver } from '../driver.model';
import { AdminApiService } from '../../admin-api.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  driver: any;
  trips: Array<any>

  constructor(public dialogRef: MatDialogRef<DriverComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public adminApiService: AdminApiService) {

    this.driver = data.driver;
    this.trips = data.trips;
    console.log(data);
  }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(driver: any): void {
    console.log('onSubmit', driver);
    this.dialogRef.close(driver);
  }
}
