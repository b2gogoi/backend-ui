import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminApiService} from '../admin-api.service';
import {MatSnackBar, MatPaginator, MatSort} from '@angular/material';
import {Router} from '@angular/router';
import {TalaDatabase} from '../tala.database';
import {TalaDatasource} from '../tala.datasource';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  totals: any = {};
  drivers: any = {};
  duration = 2000;

  applicationDatabase: TalaDatabase = new TalaDatabase([]);
  driverDatabase: TalaDatabase = new TalaDatabase([]);

  dataSource: TalaDatasource | null;
  driverDataSource: TalaDatasource | null;
  header: any = {};
  driverHeader: any = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['tripId', 'date', 'time', 'distance', 'amount', 'referralEarnings'];
  driverDisplayedColumns = ['driverId', 'name', 'earnings', 'payable', 'referralEarnings', 'referralEarnings'];

  constructor(public adminApiService: AdminApiService,
              public snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit() {

    this.header = {
      'tripId': 'Trip Id',
      'date': 'Trip Date',
      'time': 'Trip End Time',
      'distance': 'Trip Miles',
      'amount': 'Invoice Amount',
      'referralEarnings': 'Referral Total'
    };

    this.driverHeader = {
      'driverId': 'Driver Id',
      'name': 'Name',
      'earnings': 'Total Earnings',
      'payable': 'Remaining Payable',
      'referralEarnings': 'Referral Total'
    };

    this.adminApiService.getPaymentDetails().subscribe(
      data => {
        console.log('data :', data);
        this.totals = data.totals;
        this.drivers = data.drivers;

        if (this.totals.data.length > 0) {
          this.applicationDatabase = new TalaDatabase(this.totals.data);

          this.dataSource = new TalaDatasource(
            this.applicationDatabase,
            this.paginator,
            this.sort,
            this.getActiveColumnForSorting);
        }

        if (this.drivers.data.length > 0) {
          this.driverDatabase = new TalaDatabase(this.drivers.data);

          this.driverDataSource = new TalaDatasource(
            this.driverDatabase,
            this.paginator,
            this.sort,
            this.getActiveColumnForSortingDriver);
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

  openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
  }

  getActiveColumnForSorting(activeColumn: string, a, b): Array<any> {

    let propertyA: number|string = '';
    let propertyB: number|string = '';

    switch (activeColumn) {
      case 'tripId': [propertyA, propertyB] = [a.tripId, b.tripId]; break;
      case 'date': [propertyA, propertyB] = [a.date, b.date]; break;
      case 'time': [propertyA, propertyB] = [a.time, b.time]; break;
      case 'amount': [propertyA, propertyB] = [a.amount, b.amount]; break;
      case 'distance': [propertyA, propertyB] = [a.distance, b.distance]; break;
      case 'referralEarnings': [propertyA, propertyB] = [a.referralEarnings, b.referralEarnings]; break;
    }

    return [propertyA, propertyB];
  }

  getActiveColumnForSortingDriver(activeColumn: string, a, b): Array<any> {

    let propertyA: number|string = '';
    let propertyB: number|string = '';

    switch (activeColumn) {
      case 'driverId': [propertyA, propertyB] = [a.driverId, b.driverId]; break;

    }

    return [propertyA, propertyB];
  }

}
