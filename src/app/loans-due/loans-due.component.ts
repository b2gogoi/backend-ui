import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminApiService} from '../admin-api.service';
import {MatPaginator, MatSnackBar, MatSort} from '@angular/material';
import {DatePipe} from '@angular/common';
import {TalaDatabase} from '../tala.database';
import {TalaDatasource} from '../tala.datasource';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loans-due',
  templateUrl: './loans-due.component.html',
  styleUrls: ['./loans-due.component.css']
})
export class LoansDueComponent implements OnInit {
  filterForm: FormGroup;
  filterMap: any;
  loansDue: Array<any>;
  loansDueDatabase: TalaDatabase = new TalaDatabase([]);
  displayedColumns = ['userId', 'mobileNumber', 'name', 'amountDue', 'loanId', 'dueDate', 'action'];
  header: any = {};
  customCellView: any = {};

  dataSource: TalaDatasource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private adminApiService: AdminApiService,
    private datePipe: DatePipe,
    private router: Router,
    private fb: FormBuilder,
    public snackBar: MatSnackBar) {  }

  ngOnInit() {
    const now = new Date();
    // const today = this.datePipe.transform(now, 'yyyy-MM-ddThh:mmTZ');

    this.filterMap = { duedate: now };
    this.filterForm = this.fb.group({
      'duedate': ['', Validators.required]
    });

    this.header = {
      userId: 'Id',
      loanId: 'Loan Id',
      mobileNumber: 'Phone',
      name: 'Name',
      amountDue: 'Amount Due',
      dueDate: 'Due Date'
    };

    this.customCellView = {
      name : (value) => { return `<a href="/dashboard/customer/${value}">${value}</a>`; }
    };

    this.getLoansDue();
  }

  getLoansDue() {
    console.log(this.filterMap);

    const clone = Object.assign({}, this.filterMap);
    clone.duedate = this.datePipe.transform(clone.duedate, 'dd-MMM-yy');
    console.log(clone);

    this.adminApiService.getLoansDue(clone
    ).subscribe(
      data => {
        console.log(data);

        // if (data && data.length > 0) {
          this.loansDue = data;
          this.loansDueDatabase = new TalaDatabase(this.loansDue);
          this.dataSource = new TalaDatasource(
            this.loansDueDatabase,
            this.paginator,
            this.sort,
            this.getActiveColumnForSorting);
        // }

        // this.openSnackBar(`Got ${data.length} loans for due`, null);
      },
      err => {
        this.openSnackBar('Some error', null);
      }
    );
  }

  getActiveColumnForSorting(activeColumn: string, a, b): Array<any> {

    let propertyA: number|string = '';
    let propertyB: number|string = '';

    switch (activeColumn) {
      case 'loanId': [propertyA, propertyB] = [a.loanId, b.loanId]; break;
      case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
      case 'mobileNumber': [propertyA, propertyB] = [a.mobileNumber, b.mobileNumber]; break;
      case 'amountDue': [propertyA, propertyB] = [a.amountDue, b.amountDue]; break;
      case 'dueDate': [propertyA, propertyB] = [a.dueDate, b.dueDate]; break;
    }

    return [propertyA, propertyB];
  }

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      announcementMessage: 'Error'
    });
  }

  showUser(userId: string): void {
    console.log('userId : ', userId);
    this.router.navigate([`/dashboard/customer/${userId}`]);
  }

}
