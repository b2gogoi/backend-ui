import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import { ApprovalControl } from './approval-control.model';
import { AdminApiService } from '../admin-api.service';
import {ExperimentComponent} from './experiment/experiment.component';

@Component({
  selector: 'app-approval-controls',
  templateUrl: './approval-controls.component.html',
  styleUrls: ['./approval-controls.component.css']
})
export class ApprovalControlsComponent implements OnInit {
  controlsForm: FormGroup;
  controlModel: ApprovalControl;
  comparators: string[] = ['=', '<', '>', '>=', '<='];
  duration = 2000;

  constructor(public snackBar: MatSnackBar,
              public adminApiService: AdminApiService,
              private fb: FormBuilder,
              public dialog: MatDialog) { }

  ngOnInit() {

    this.getCurrentApprovalControl();

    this.controlsForm = this.fb.group({
      'bound': ['', Validators.required],
      'operator': ['', Validators.required],
      'operand': ['', Validators.required]
    });


  }

  update(form: any): void {
    console.log('you submitted value:', form);

    this.controlModel.bound = form.bound;
    this.controlModel.operator = form.operator;
    this.controlModel.operand = form.operand;
    this.controlModel.updatedBy = localStorage.getItem('username');
    this.controlModel.updatedAt = (new Date()).getTime();

    console.log('control:', this.controlModel);

    this.adminApiService.updateApprovalControl(this.controlModel).subscribe(
      data => {
        console.log('Approval control updated : ', data);
        this.controlModel = data;
        this.openSnackBar('Approval control has been updated successfully', null, this.duration);
      },
      error => {
        const errCode: number = error.status;

        if (504 === errCode) {
          this.openSnackBar(error, null, this.duration);

        } else {
          const errBody: any = error.json();
          console.log('Err', errCode);

          this.openSnackBar(errBody.message, null, this.duration);
        }
      });
  }

  experiment(form: any): void {
    console.log('Experiment value:', form);

    this.controlModel.bound = form.bound;
    this.controlModel.operator = form.operator;
    this.controlModel.operand = form.operand;

    console.log('control:', this.controlModel);

    this.adminApiService.experiment(this.controlModel).subscribe(
      data => {
        console.log('Experiment : ', data);

        const dialogRef = this.dialog.open(ExperimentComponent, {
          width: '400px',
          data: data
        });
      },
      error => {
        const errCode: number = error.status;

        if (504 === errCode) {
          this.openSnackBar(error, null, this.duration);

        } else {
          const errBody: any = error.json();
          console.log('Err', errCode);

          this.openSnackBar(errBody.message, null, this.duration);
        }
      });
  }

  getCurrentApprovalControl(): void {
    this.adminApiService.getCurrentApprovalControl().subscribe(
      data => {
        console.log('Current approval control :', data);

        if (data) {
          this.controlModel = data;
        }
      },
      error => {
        const errCode: number = error.status;

        if (504 === errCode) {
          this.openSnackBar(error , null, this.duration);
        } else {
          const errBody: any = error.json();
          console.log('Err', errCode);

          this.openSnackBar(errBody.message, null, this.duration);
        }

      }
    );
  }

  private openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
  }

}
