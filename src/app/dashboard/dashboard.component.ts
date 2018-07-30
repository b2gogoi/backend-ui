import { Component, OnInit } from '@angular/core';
import {AdminApiService} from '../admin-api.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = [
    {icon: 'home', text: 'One', count: 40, cols: 1, rows: 1, color: 'grey'},
    {icon: 'user', text: 'Two', count: 40, cols: 1, rows: 1, color: 'lightgreen'},
    {icon: 'home', text: 'Three', count: 40, cols: 1, rows: 1, color: 'lightpink'},
    {icon: 'home', text: 'Four', count: 40, cols: 1, rows: 1, color: '#DDBDF1'},
  ];

  duration = 2000;

  passengersData: any;
  dashBoardData: any;

  constructor(public adminApiService: AdminApiService,
              public snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
  }

  ngOnInit() {
    this.getLivePassengers();
    this.adminApiService.getDashboardStats().subscribe(
      data => {

        this.dashBoardData = data;

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

  getLivePassengers(): void {
    this.adminApiService.getLivePassengers().subscribe(
      data => {
        this.passengersData = data;
      },
      error => {
        console.log('Err', error);
      }
    );
  }

}
