import { Component, ElementRef, Inject, OnInit, Renderer, ViewChild } from '@angular/core';
import { MatSnackBar} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Employee } from '../employee.model';

import { AdminApiService } from '../admin-api.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  driver: any;
  docs: any[] = [];
  documents: any = {
    tlc: { message: 'TLC license', placeholderText: 'TLC License No.'},
    license: { message: 'Driver\'s license', placeholderText: 'Driver\'s License' },
    insurance: { message: 'Insurance Certificate', placeholderText: 'Insurance Certificate' },
    registration: { message: 'Commercial Vehicle Registration', placeholderText: 'Commercial Vehicle Registration' },
    permit: { message: 'TLC-for-hire Vehicle Permit license', placeholderText: 'TLC-for-hire Vehicle Permit' }
  };

  docSequence: string[] = ['tlc', 'license', 'insurance', 'registration', 'permit'];

  duration = 2000;
  verificationForm: FormGroup;
  vehicleTypes: Array<any>;
  subscription: Subscription;

  successMsg = {
    tlc: 'TLC license uploaded successfully',
    drivers: 'Drivers license uploaded successfully',
    insuranceCert: 'Insurance Certificate uploaded successfully',
    commercialVehicleReg: 'Commercial Vehicle Registration uploaded successfully',
    tlcVehiclePermit: 'TLC-for-hire Vehicle Permit uploaded successfully'
  };

  file: File;
  fileName: string;
  fileUploaded = false;

  dlFile: File;
  dlFileName: string;
  dlFileUploaded = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(public snackBar: MatSnackBar, private http: Http,
              private fb: FormBuilder, private renderer: Renderer,
              private activatedRoute: ActivatedRoute,
              public adminApiService: AdminApiService) {

    this.verificationForm = fb.group({
      'plateNo': ['', [Validators.required]],
      'modelMake': ['', [Validators.required]],
      'registration': ['', [Validators.required]],
      'license': ['', [Validators.required]],
      'license_expiry': ['', [Validators.required]],
      'tlc_license_no': ['', [Validators.required]],
      'tlc_license_expiry': ['', [Validators.required]],
      'tlc_license_img_url': ['', [Validators.required]],
      'vehicleType': ['', null]
    });
  }

  ngOnInit() {
    this.getVehicleTypes();

    // subscribe to router event
    this.subscription = this.activatedRoute.params.subscribe((params: ParamMap) => {
      console.log('driverId : ', params['id']);

      const driverId = params['id'];

      this.adminApiService.getDriverDetails(driverId).subscribe(
        data => {
          console.log('driver :', data);
          this.driver = data;

          this.adminApiService.getDriverDocs(driverId).subscribe(
            docs => {
              console.log('docs :', docs);

              if (docs.length > 0) {
                docs.forEach( d => {
                  const type = d['doc_type'];

                  this.documents[type].uploaded = true;
                  this.documents[type].doc = d;
                });
              }

              this.docSequence.forEach(seq => {

                this.documents[seq].type = seq;
                console.log(this.documents[seq]);
                this.docs.push(this.documents[seq]);
              });
              console.log(this.docs);
            },
            error => {
              console.log('Err', error);
              const errCode: number = error.status;

              if (504 === errCode) {
                this.openSnackBar(error, null, this.duration);

              } else {
                const errBody: any = error.json();
                console.log('Err', errCode);

                this.openSnackBar(errBody.message, null, this.duration);
              }
            }
          );
        },
        error => {
          console.log('Err', error);
          const errCode: number = error.status;

          if (504 === errCode) {
            this.openSnackBar(error, null, this.duration);

          } else {
            const errBody: any = error.json();
            console.log('Err', errCode);

            this.openSnackBar(errBody.message, null, this.duration);
          }
        }
      );


    });

    /**/
  }

  onNoClick(): void {
    // this.dialogRef.close();
  }

  updateDriver(driver: any): void {
    this.adminApiService.updateDriverApplication(driver.id,  driver).subscribe(
      data => {
        this.openSnackBar('Driver verified', null, this.duration);
      },
      error => {
        console.log('Err', error);
        const errCode: number = error.status;

        if (504 === errCode) {
          this.openSnackBar(error, null, this.duration);

        } else {
          const errBody: any = error.json();
          console.log('Err', errCode);

          this.openSnackBar(errBody.message, null, this.duration);
        }
      }
    );
  }

  onSubmit(driver: any): void {
    console.log('onSubmit', driver);
    this.updateDriver(driver);
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

  /*upload(type): void {

    let fileToUpload: File = null;

    if ('drivers' === type) {
      fileToUpload = this.dlFile;

    } else {
      fileToUpload = this.file;
    }

    console.log('Uploading file : ' + fileToUpload.name);
    console.log('Uploading file type : ' + type);

    const formData: FormData = new FormData();
    formData.append('upload', fileToUpload, fileToUpload.name);

    const headers = new Headers();
    headers.append('Accept', 'application/json');

    this.http.post(`/server/file-upload/type/${type}`, formData)
      .map((response: Response) => {
        return (<any>response.json());
      }).subscribe(
      data => {
        console.log(data);
        this.fileUploaded = true;
        this.openSnackBar(this.successMsg[type], null, this.duration);
        this.clear();
      },

      error => this.openSnackBar('Error occurred during file upload', null, this.duration)

    );

  }*/

  /*mock(): void {
    if (!this.file) {
      const event = new MouseEvent('click', {bubbles: true});
      this.renderer.invokeElementMethod(
        this.fileInput.nativeElement, 'dispatchEvent', [event]);
    }
  }

  clear(): void {
    // this.fileName = null;
    this.file = null;
    // this.fileUploaded = false;

    // this.fileInput.nativeElement.value = null;
  }*/

  openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
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
