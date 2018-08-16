import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort} from '@angular/material';
import {AdminApiService} from '../admin-api.service';
import {TalaDatabase} from '../tala.database';
import {TalaDatasource} from '../tala.datasource';
import {TypeComponent} from './type/type.component';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css']
})
export class VehicleTypeComponent implements OnInit {

  duration = 2000;
  header: any = {};
  displayedColumns = ['id', 'type', 'county', 'initial_charge', 'per_mile',
    'commission_percentage', 'cancellation_charge',
    'airport', 'airport_initial_charge', 'airport_per_mile', 'airport_per_minute', 'updated_at'];

  vehicleTypes: Array<any> = [];

  applicationDatabase: TalaDatabase = new TalaDatabase([]);

  dataSource: TalaDatasource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public adminApiService: AdminApiService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.header = {
      'id': 'Id',
      'type': 'Class',
      'county': 'County',
      'initial_charge': 'Initial Charge',
      'per_mile': 'Per mile',
      'commission_percentage': 'Commission',
      'cancellation_charge': 'Cancellation',
      'airport': 'Airport',
      'airport_initial_charge': 'Airport Initial Charge',
      'airport_per_mile': 'Airport per mile',
      'airport_per_minute': 'Airport per minute',
      'updated_at': 'Updated At'
    };

    this.allVehicleTypes();
  }

  allVehicleTypes(): void {

    this.adminApiService.allVehicleTypes().subscribe(
      data => {
        console.log('vehicle types :', data.length);
        this.vehicleTypes = data;
        this.applicationDatabase = new TalaDatabase(data);

        this.dataSource = new TalaDatasource(
          this.applicationDatabase,
          this.paginator,
          this.sort,
          this.getActiveColumnForSorting);
      },
      error => {
        console.log('Err', error);
      }
    );
  }

  getActiveColumnForSorting(activeColumn: string, a, b): Array<any> {

    let propertyA: number|string = '';
    let propertyB: number|string = '';

    [propertyA, propertyB] = [a[activeColumn], b[activeColumn]];

    return [propertyA, propertyB];
  }

  openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TypeComponent, {
      width: '1000px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed, new vehicle type created : ', result);
        this.addNewType(result);

      } else {
        // User clicked 'Cancel' or clicked outside the dialog
      }
    });
  }

  addNewType(result: any): void {
    this.adminApiService.addNewVehicleType(result).subscribe(
        data => {
          console.log('New Vehicle type created :', data.type);

          this.vehicleTypes.push(data.type);

          this.applicationDatabase = new TalaDatabase(this.vehicleTypes);

          this.dataSource = new TalaDatasource(
            this.applicationDatabase,
            this.paginator,
            this.sort,
            this.getActiveColumnForSorting);

          const msg = `A new vehicle type was created successfully`;

          this.openSnackBar(msg, null, this.duration);
        },
        err => {
          this.openSnackBar(`Unable to add new vehicle type: `,
            null, this.duration);
        });
  }
}
