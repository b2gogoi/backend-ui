import { Component, OnInit } from '@angular/core';

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

  passengersData: any;
  dashBoardData: any;

  constructor() { }

  ngOnInit() {
    this.dashBoardData = {
      driversAvailability: {
        online: 24,
        total: 39
      },
      driversPending: 2,
      totalEarnings: 8097.47,
      totalTrips: 329,
      totalDistance: 15939.67,
      rideStats : {
        live: 0,
        cancelled: 2,
        completed: 16
      }
    }

    this.passengersData = {
      total: 16,
      passengers: [
        {
          name: 'Bhaskar',
          accountId: 4
        },
        {
          name: 'Basab',
          accountId: 4
        },
        {
          name: 'Mousom',
          accountId: 4
        },
        {
          name: 'Sumanth',
          accountId: 4
        },
        {
          name: 'Jahnab',
          accountId: 4
        },
        {
          name: 'Manu',
          accountId: 4
        }
      ]
    };
  }

}
