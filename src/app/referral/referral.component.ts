import { Component, OnInit } from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AdminApiService} from '../admin-api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {

  refStat: any;

  constructor(public adminApiService: AdminApiService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
    this.getReferralData();
  }

  getReferralData(): void {
    this.adminApiService.getReferralStats().subscribe(
      data => {
        this.refStat = data;
        console.log(this.refStat);
      },
      error => {
        console.log('Err', error);
        const errCode: number = error.status;

        if (504 === errCode) {
          this.openSnackBar(error, null);

        } else {
          const errBody: any = error.json();
          console.log('Err', errCode);

          this.openSnackBar(errBody.message, null);
        }
      }
    );
  }

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      announcementMessage: 'Error'
    });
  }

}
