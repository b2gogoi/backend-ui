import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatPaginator, MatSnackBar, MatSort} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { AdminApiService } from '../admin-api.service';
import {TalaDatabase} from '../tala.database';
import {TalaDatasource} from '../tala.datasource';
import {DriverComponent} from './driver/driver.component';
// import {Employee} from '../admin/employee.model';
// import {EmployeeComponent} from '../admin/employee/employee.component';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {

  vehicleTypes: Array<any>;
  duration = 2000;
  header: any = {};
  displayedColumns = ['id', 'name', 'phone', /*'email',*/
    'active', 'vehicleType', 'plateNo', 'modelMake',
    'updatedAt', 'action'];

  applicationDatabase: TalaDatabase = new TalaDatabase([]);

  dataSource: TalaDatasource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public adminApiService: AdminApiService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
    console.log('HomeComponent');
    this.header = {
      'id': 'Driver Id',
      'name': 'Name',
      'phone': 'Cell Phone',
      'email': 'Email Address',
      'active': 'Online',
      'vehicleType': 'Class',
      'modelMake': 'Vehicle',
      'plateNo': 'Plate',
      'updatedAt': 'Last Update'
    }

    this.getVehicleTypes();
    this.getDrivers();
  }

  openDialog(driver: any): void {

    const dialogRef = this.dialog.open(DriverComponent, {
      width: '800px',
      data: driver
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed : ', result);
        // this.updateDriver(result);

      } else {
        // User clicked 'Cancel' or clicked outside the dialog
      }
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

  /*updateDriver(driver: any): void {
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
  }*/

  getDrivers(): void {
    this.adminApiService.getDrivers().subscribe(
      data => {
        console.log('No. of verified drivers :', data.length);

        if (data.length > 0) {
          this.applicationDatabase = new TalaDatabase(data);

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

  showDriver(driver: any): void {
    console.log('driver id : ', driver.id);

    this.adminApiService.getDriverTripHistory(driver.id).subscribe(
      data => {
        console.log('driver :', data);
        const driverDetails = {
          driver: driver,
          trips: data
        }
        this.openDialog(driverDetails);
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

  openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
  }

  getActiveColumnForSorting(activeColumn: string, a, b): Array<any> {

    let propertyA: number|string = '';
    let propertyB: number|string = '';

    switch (activeColumn) {
      case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
      case 'firstname': [propertyA, propertyB] = [a.firstname, b.firstname]; break;
      case 'lastname': [propertyA, propertyB] = [a.lastname, b.lastname]; break;
      case 'phone': [propertyA, propertyB] = [a.phone, b.phone]; break;
      case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
      case 'active': [propertyA, propertyB] = [a.active, b.active]; break;
      case 'vehicleType': [propertyA, propertyB] = [a.vehicleType, b.vehicleType]; break;
      case 'modelMake': [propertyA, propertyB] = [a.modelMake, b.modelMake]; break;
      case 'plateNo': [propertyA, propertyB] = [a.plateNo, b.plateNo]; break;
      case 'updatedAt': [propertyA, propertyB] = [a.updatedAt, b.updatedAt]; break;
    }

    return [propertyA, propertyB];
  }
}
