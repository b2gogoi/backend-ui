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

  constructor() { }

  ngOnInit() {
  }

}
