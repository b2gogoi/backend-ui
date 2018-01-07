import { Component, OnInit } from '@angular/core';
import { LoanTerm } from './loan-term.model';
import { AdminApiService } from '../admin-api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LoanTermComponent} from './loan-term/loan-term.component';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  currentLoanTerm: LoanTerm;
  duration: number;
  actionDuration: number;

  constructor(public adminApiService: AdminApiService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('LoanComponent');
    this.duration = 2000;
    this.actionDuration = 8000;
    this.getCurrentLoanTerm();
  }

  /*
   * Here -1 is used to identify new or existing loan term
   */
  private getLoanTermForForm(isCreate: boolean): LoanTerm {
    const loanTerm = true === isCreate ? new LoanTerm(-1, true, 0, 0, 0, 0, 0)
      : Object.assign({}, this.currentLoanTerm);

    if (isCreate) {
      delete loanTerm.interestRate;
      delete loanTerm.tenure;
      delete loanTerm.minAmt;
      delete loanTerm.firstLoanLimit;
      delete loanTerm.maxAmt;
    }

    return loanTerm;
  }

  loanLadderValidator(lt: LoanTerm): string {
    if ( lt.minAmt <= lt.firstLoanLimit && lt.firstLoanLimit <= lt.maxAmt) {
      return null;

    } else {
      let msg;
      if (lt.minAmt > lt.firstLoanLimit) {
        msg = `The first loan limit amount[${lt.maxAmt}] is less than minimum amount[${lt.minAmt}]`;

      } else if (lt.maxAmt < lt.firstLoanLimit) {
        msg = `The maximum amount[${lt.maxAmt}] is less than the first loan limit[${lt.firstLoanLimit}]`;
      }

      return msg;
    }
  }

  openLoanTermDialog(isCreate: boolean): void {
    console.log(`Loan term dialog called for creation : ${isCreate}`);

    const loanTerm = this.getLoanTermForForm(isCreate);

    const dialogRef = this.dialog.open(LoanTermComponent, {
      width: '400px',
      data: loanTerm
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Loan term request : ', result);

        const validResult = this.loanLadderValidator(result);

        if (!validResult) {
          delete result.id;
          result.current = true;

          if (isCreate) {
            this.createLoanTerm(result);

          } else {
            this.updateLoanTerm(result);
          }

          localStorage.removeItem('loan-terms');

        } else {

          if (isCreate) {
            this.openSnackBar(validResult, 'Create Loan Term', this.actionDuration);

          } else {
            this.openSnackBar(validResult, null, 4000);
          }
        }
      } else {
        console.log('User clicked Cancel or clicked outside the dialog');
      }
    });
  }

  getCurrentLoanTerm(): void {
    this.adminApiService.getCurrentLoanTerm().subscribe(
      data => {
        console.log('Current loan term :', data);

        if (data) {
          this.currentLoanTerm = new LoanTerm(
            data['id'], data['current'],
            data['interestRate'],
            data['tenure'],
            data['minAmt'],
            data['firstLoanLimit'],
            data['maxAmt']
          );
        }
      },
      error => {
        const errCode: number = error.status;

        if (504 === errCode) {
          this.gatewayTimeoutSnackbar(error , 'Retry', this.actionDuration);
        } else {
          const errBody: any = error.json();
          console.log('Err', errCode);

          if (404 === errCode) {
            this.openSnackBar(errBody.message, 'Create Loan Term', this.actionDuration);

          } else {
            this.openSnackBar(errBody.message, null, this.duration);
          }
        }

      }
    );
  }

  updateLoanTerm(loanTerm: LoanTerm): void {
    this.adminApiService.updateLoanTerm(loanTerm).subscribe(
      data => {
        console.log('Loan term updated : ', data);
        this.currentLoanTerm = data;
        this.openSnackBar('Loan term has been updated successfully', null, this.duration);
      },
      error => {
        const errCode: number = error.status;

        if (504 === errCode) {
          this.openSnackBar(error, null, this.duration);

        } else {
          const errBody: any = error.json();
          console.log('Err', errCode);

          if (404 === errCode) {
            this.openSnackBar('Unable to update loan term as there is nothing to update, please create one first',
              'Create Loan Term', this.actionDuration);

          } else {
            this.openSnackBar(errBody.message, null, this.duration);
          }
        }
      });
  }

  createLoanTerm(loanTerm: LoanTerm): void {
    this.adminApiService.createLoanTerm(loanTerm).subscribe(
      data => {
        console.log('New Loan term created : ', data);
        this.currentLoanTerm = data;
        this.openSnackBar('New loan term created successfully', null, this.duration);
      },
      error => {
        const errCode: number = error.status;

        if (504 === errCode) {
          this.openSnackBar(error, null, this.duration);

        } else {
          const errBody: any = error.json();
          console.log('Err', errCode);

          if (400 === errCode) {
            this.openSnackBar('Unable to create loan term as it has already created', null, this.duration);

          } else {
            this.openSnackBar(errBody.message, null, this.duration);
          }
        }
      });
  }

  private openSnackBar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
        duration: duration
    });

    snackRef.onAction().subscribe(() => {
      console.log('Create loan term');
      this.openLoanTermDialog(true);
    });
  }

  private gatewayTimeoutSnackbar(message: string, action: string, duration: number) {
    const snackRef = this.snackBar.open(message, action, {
      duration: duration
    });

    snackRef.onAction().subscribe(() => {
      console.log('The snack-bar action was triggered!');
      this.getCurrentLoanTerm();
    });
  }

}
