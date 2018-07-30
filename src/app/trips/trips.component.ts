import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { AdminApiService } from '../admin-api.service';
import { Router } from '@angular/router';
import { TalaDatabase } from '../tala.database';
import { TalaDatasource } from '../tala.datasource';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {

  duration = 2000;
  header: any = {};
  displayedColumns = ['id', 'vehicle_type', 'status', 'payment_status', 'cost', 'distance', 'rider_account_id', 'driver_account_id'
          , 'pickup_address', 'drop_address', 'updated_at'];

  vehicleTypes: Array<any>;
  vehicleClassMap: any;

  applicationDatabase: TalaDatabase = new TalaDatabase([]);

  dataSource: TalaDatasource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public adminApiService: AdminApiService,
              public snackBar: MatSnackBar,
              private router: Router
  ) { }

  ngOnInit() {
    this.header = {
      'id': 'Trip Id',
      'vehicle_type': 'Class',
      'status': 'Status',
      'payment_status': 'Payment',
      'rider_account_id': 'Rider Id',
      'driver_account_id': 'Driver Id',
      'updated_at': 'Date',
      'cost': 'Cost',
      'pickup_address': 'Pickup Address',
      'drop_address': 'Drop Address',
      'distance': 'Miles',

    };

    this.getVehicleTypes();
    this.getAllTrips();

  }

  getAllTrips(): void {
    this.adminApiService.getAllTrips().subscribe(
      data => {
        console.log('Total no. of trips :', data.trips.length);

        if (data.trips.length > 0) {
          data.trips.forEach((trip) => {
            trip.cost = 'completed' === trip.status ? trip['actual_cost'] : trip['estimate_cost'];
            trip.distance = 'completed' === trip.status ? trip['actual_distance'] : trip['estimate_distance'];
          });
          this.applicationDatabase = new TalaDatabase(data.trips);

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

  openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
  }

  getActiveColumnForSorting(activeColumn: string, a, b): Array<any> {

    let propertyA: number|string = '';
    let propertyB: number|string = '';

    [propertyA, propertyB] = [a[activeColumn], b[activeColumn]];

    return [propertyA, propertyB];
  }

  getVehicleTypes(): void {

    const types = localStorage.getItem('vehicle-types');

    if (types) {
      this.vehicleTypes = JSON.parse(types);
      this.createVehicleClassMap();

    } else {
      this.adminApiService.getVehicleTypes().subscribe(
        data => {
          console.log('vehicle types :', data.length);
          this.vehicleTypes = data;
          this.createVehicleClassMap();
          localStorage.setItem('vehicle-types', JSON.stringify(data));
        },
        error => {
          console.log('Err', error);
        }
      );
    }
  }

  createVehicleClassMap(): void {
    this.vehicleClassMap = this.vehicleTypes.reduce((acc, v) => {
      acc[v.type] = v.info;
      return acc;
    }, {});

    console.log(this.vehicleClassMap);
  }

}
