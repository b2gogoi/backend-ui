import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatPaginator, MatSnackBar, MatSort} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { User } from './user.model';
import { AdminApiService } from '../admin-api.service';
import {TalaDatabase} from '../tala.database';
import {TalaDatasource} from '../tala.datasource';
import {Employee} from '../employee.model';
import {EmployeeComponent} from '../employee/employee.component';
import {ApplComponent} from './appl/appl.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  vehicleTypes: Array<any>;
  duration = 2000;
  header: any = {};
  displayedColumns = ['firstname', 'lastname', 'phone', 'email', 'created_at', 'action'];
  applications: any[];
  applicationDatabase: TalaDatabase = new TalaDatabase([]);

  dataSource: TalaDatasource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public adminApiService: AdminApiService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    console.log('HomeComponent');
    this.header = {
      'firstname': 'First Name',
      'lastname': 'Last Name',
      'phone': 'Cell Phone',
      'email': 'Email Address',
      'created_at': 'App Submission Date',
      'action': ''
    };

    this.getVehicleTypes();
    this.getDriverApplications();
  }

  openDialog(): void {
    const newUser: any = {
      id: -1,
      firstname: '',
      lastname: '',
      code: '',
      phone: '',
      type: 'driver',
      password: '',
      email: null,
    };

    const dialogRef = this.dialog.open(ApplComponent, {
      width: '800px',
      data: newUser
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed, driverAppl : ', result);
        this.regDriverAppl(result);

      } else {
        // User clicked 'Cancel' or clicked outside the dialog
      }
    });
  }

  regDriverAppl(appl: any): void {
    this.adminApiService.registerDriverAppl(appl).subscribe(
        data => {
          console.log('Appl created :', data);

          const driver = data.data;

          const msg = `Driver application for ${driver.firstname} was created successfully`;

          this.applications.push(driver);
          console.log(this.applications);
          this.applicationDatabase.dataChange.next(this.applications);

          this.openSnackBar(msg, null, this.duration);

        },
        err => {
          this.openSnackBar(`Unable to register driver application for : ${appl.firstname}`,
            null, this.duration);
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

  getDriverApplications(): void {
    this.adminApiService.getDriverApplications().subscribe(
      data => {
        console.log('No. of applications :', data.length);

        if (data.length > 0) {
          this.applications = data;
          this.applicationDatabase = new TalaDatabase(this.applications);

          this.dataSource = new TalaDatasource(
            this.applicationDatabase,
            this.paginator,
            this.sort,
            this.getActiveColumnForSorting);
        }
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

  showDriverApplication(id: number): void {
    console.log('driver id : ', id);
    this.router.navigate([`/applications/driver/${id}`]);
  }

  openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
  }

  getActiveColumnForSorting(activeColumn: string, a, b): Array<any> {

    let propertyA: number|string = '';
    let propertyB: number|string = '';

    switch (activeColumn) {
      case 'firstname': [propertyA, propertyB] = [a.firstname, b.firstname]; break;
      case 'lastname': [propertyA, propertyB] = [a.lastname, b.lastname]; break;
      case 'phone': [propertyA, propertyB] = [a.phone, b.phone]; break;
      case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
      case 'created_at': [propertyA, propertyB] = [a.role, b.role]; break;
    }

    return [propertyA, propertyB];
  }

}

