import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminApiService} from '../../admin-api.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {

  typeForm: FormGroup;
  dataSet: any;

  constructor(public dialogRef: MatDialogRef<TypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public adminApiService: AdminApiService) {

    this.typeForm = fb.group({
      'type': ['', null],
      'county': ['', null],
      'airport': ['', null],
      'airport_initial_charge': ['', null],
      'airport_per_mile': ['', null],
      'airport_per_minute': ['', null],
      'initial_charge': ['', null],
      'per_mile': ['', null],
      'commission_percentage': ['', null],
      'cancellation_charge': ['', null],
    });
  }

  ngOnInit() {
    this.fillDataSet();
  }

  fillDataSet(): void {
    this.dataSet = {};
    this.dataSet.vehicleTypes = ['Economy', 'Comfort', 'Black'];
    this.dataSet.county = ['New York', 'Nassau', 'Suffolk'];
    this.dataSet.airport = {
      'New York': ['John F. Kennedy International Airport(JFK)', 'LaGuardia Airport (LGA)']
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(type: any): void {
    console.log('onSubmit', type);
    this.dialogRef.close(type);
  }

}
