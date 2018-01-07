import {Component, ElementRef, Inject, OnInit, Renderer, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Employee } from '../employee.model';

import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  driver: any;
  verificationForm: FormGroup;
  vehicleTypes: Array<any>;

  file: File;
  fileName: string;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(public dialogRef: MatDialogRef<EmployeeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder, private renderer: Renderer,
              public adminApiService: AdminApiService) {

    this.driver = data;

    this.verificationForm = fb.group({
      'plateNo': ['', [Validators.required]],
      'modelMake': ['', [Validators.required]],
      'registration': ['', [Validators.required]],
      'license': ['', [Validators.required]],
      'tlc_license_no': ['', [Validators.required]],
      'tlc_license_expiry': ['', [Validators.required]],
      'tlc_license_img_url': ['', [Validators.required]],
      'vehicleType': ['', null]
    });
  }

  ngOnInit() {
    this.getVehicleTypes();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(driver: any): void {
    console.log('onSubmit', driver);
    this.dialogRef.close(driver);
  }

  fileChange(event): void {
    console.log(event);

    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.file = fileList[0];
      this.fileName = this.file.name;
      console.log(`filename set to : ${this.fileName}`);
    }

  }

  mock(): void {
    if (!this.file) {
      const event = new MouseEvent('click', {bubbles: true});
      this.renderer.invokeElementMethod(
        this.fileInput.nativeElement, 'dispatchEvent', [event]);
    }
  }

  clear(): void {
    this.fileName = null;
    this.file = null;

    // this.fileInput.nativeElement.value = null;
  }

  getVehicleTypes(): void {

    const types = localStorage.getItem('vehicle-types');

    if (types) {
      this.vehicleTypes = JSON.parse(types);

    } else {
      this.adminApiService.getVehicleTypes().subscribe(
        data => {
          console.log('vehicle types :', data.length);
          this.vehicleTypes = data;
          localStorage.setItem('vehicle-types', JSON.stringify(data));
        },
        error => {
          console.log('Err', error);
        }
      );
    }
  }

}
