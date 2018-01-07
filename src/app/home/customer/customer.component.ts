import {Component, OnDestroy, OnInit} from '@angular/core';
import { AdminApiService } from '../../admin-api.service';
import { User } from '../user.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {LoanTerm} from '../../loan/loan-term.model';
import {LoanApplicationComponent} from './loan-application/loan-application.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {
  user: User;
  duration = 2000;
  subscription: Subscription;
  transactions: Array<any> = [];
  loans: Array<any> = [];
  loanTerms: LoanTerm[];

  constructor(public adminApiService: AdminApiService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getLoanTerms();

    // subscribe to router event
    this.subscription = this.activatedRoute.params.subscribe((params: ParamMap) => {
      const userId = params['id'];
      console.log('userId : ', userId);

      const user = parseInt(userId, 0);

      this.getUser(user);
      this.getUserLoans(user);
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }

  openDialog(loan: any): void {

    const questionnaire = JSON.parse(loan.questionnaire);

    const dialogRef = this.dialog.open(LoanApplicationComponent, {
      width: '800px',
      data: questionnaire
    });
  }

  getUser(id: number): void {
    this.adminApiService.getUser(id).subscribe(
      data => {
        console.log('user :', data);
        this.user = data;

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

  getUserLoans(id: number): void {
    this.adminApiService.getUserLoans(id).subscribe(
      data => {
        console.log('loans :', data);
        this.loans = data;

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

  getUserCurrentLoan(id: number): void {
    this.adminApiService.getUserCurrentLoan(id).subscribe(
      data => {
        console.log('current loan app:', data);

        const loan = data;

        this.openDialog(loan);

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

  getLoanTerms(): void {

    const loanTerms = localStorage.getItem('loan-terms');

    if (loanTerms) {
      this.loanTerms = JSON.parse(loanTerms);

    } else {

      this.adminApiService.getLoanTerms().subscribe(
        data => {
          console.log('loan terms:', data);
          this.loanTerms = data;
          localStorage.setItem('loan-terms', JSON.stringify(data));
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
  }

  openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });
  }

  getLoanTerm(loanTermId: number): LoanTerm {

    for (let i = 0; i < this.loanTerms.length; i++) {
      if (loanTermId === this.loanTerms[i].id) {
        return this.loanTerms[i];
      }
    }
    return null;

  }

}
