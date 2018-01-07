import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.css']
})
export class VolumeControlComponent implements OnInit {
  controlsForm: FormGroup;
  controlModel: any;
  duration = 2000;

  constructor(public adminApiService: AdminApiService,
              private fb: FormBuilder,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('Volume Controls');
    this.controlsForm = this.fb.group({
      'applicationCap': ['', [Validators.required, Validators.min(0)]],
      'disbursementCap': ['', [Validators.required, Validators.min(0)]]
    })
    this.getVolumeControl();
  }

  getVolumeControl(): void {
    this.adminApiService.getVolumeControl().subscribe(
      data => {
        console.log('Current volume control :', data);

        if (data) {
          this.controlModel = data;

        } else {
          this.openSnackBar('Volume controls not set', 'CREATE', this.duration);
        }
      },
      error => {
        const errCode: number = error.status;

        if (504 === errCode) {
          this.openSnackBar(error, null, this.duration);

        } else {
          let errMsg = `Error occured : ${errCode}`;
          if (error) {
            try {
              const errBody: any = error.json();
              errMsg = errBody.message;

            } catch (e) {
              errMsg = error;
            }

          } else {
            errMsg = 'No volume control found';
          }

          console.log('Err', errCode);

          this.openSnackBar(errMsg, null, this.duration);
        }

      }
    );
  }

  update(): void {
    console.log('you submitted value:', this.controlModel);

    this.controlModel.updatedBy = localStorage.getItem('username');
    console.log('control:', this.controlModel);

    this.adminApiService.updateVolumeControl(this.controlModel).subscribe(
      data => {
        console.log('Volume control updated : ', data);
        this.controlModel = data;
        this.openSnackBar('Volume control has been updated successfully', null, this.duration);
      },
      error => {
        const errCode: number = error.status;

        if (504 === errCode) {
          this.openSnackBar(error, null, this.duration);

        } else {
          let errMsg = `Error occured : ${errCode}`;
          if (error && error.json()) {
            const errBody: any = error.json();
            errMsg = errBody.message;

          } else {
            errMsg = 'No volume control found';
          }

          console.log('Err', errCode);

          this.openSnackBar(errMsg, null, this.duration);
        }
      });
  }

  private openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });

    snackRef.onAction().subscribe(() => {
      console.log('Create loan term');
      // this.openLoanTermDialog(true);
    });
  }
}




