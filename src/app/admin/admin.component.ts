import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TalaDatabase} from '../tala.database';
import {TalaDatasource} from '../tala.datasource';
import {MatDialog, MatPaginator, MatSnackBar, MatSort} from '@angular/material';
import {AdminApiService} from '../admin-api.service';
import {UserComponent} from './user/user.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  filterForm: FormGroup;
  employees: any[];
  isFiltered = false;
  roles: any[];
  duration: number;
  displayedColumns = ['id', 'username', 'name', 'role', 'email'];
  header: any = {};

  filteredDatabase: TalaDatabase = new TalaDatabase([]);

  dataSource: TalaDatasource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(public adminApiService: AdminApiService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              private fb: FormBuilder) { }

  openDialog(): void {
    const newUser: any = {
      id: -1,
      username: '',
      name: '',
      role: '',
      password: '',
      email: null,
    };

    const dialogRef = this.dialog.open(UserComponent, {
      width: '800px',
      data: newUser
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed, username : ', result);
        this.createUser(result);

      } else {
        // User clicked 'Cancel' or clicked outside the dialog
      }
    });
  }

  createUser(newEmp: any): void {
    this.adminApiService
      .createEmployee(newEmp.username, newEmp.name,
        newEmp.role, newEmp.email, newEmp.password)
      .subscribe(
        data => {
          console.log('Employee created :', data);

          const emp = data.employee;

          const msg = `User ${newEmp.username} was created successfully`;

          this.employees.push(emp);
          console.log(this.employees);
          this.filteredDatabase.dataChange.next(this.employees);

          this.openSnackBar(msg, null, this.duration);

        },
        err => {
          this.openSnackBar(`Unable to create user: ${newEmp.username}`,
            null, this.duration);
        });
  }

  ngOnInit() {
    this.employees = [];
    this.filterForm = this.fb.group({
      'id': ['', [Validators.min(1)]],
      'username': ['', null],
      'name': ['', null],
      'role': ['', null],
      'email': ['', null],
      'password': ['', null]
    });

    this.roles = [
      {
        role: 'admin'
      },
      {
        role: 'operations'
      },
      {
        role: 'finance'
      }
    ];

    // this.getRoles();
    this.getEmployees();
    this.duration = 2000;
    this.header['id'] = 'Id';
    this.header['username'] = 'Username';
    this.header['name'] = 'Name';
    this.header['role'] = 'Role';
    this.header['email'] = 'Email';
    console.log('AdminComponent');
  }

  filterTable(filters) {
    console.log(filters);

    let filteredData;
    let hasFilter = false;

    Object.keys(filters).forEach(key => {
      const value = filters[key];

      if (value) {
        hasFilter = true;
        this.isFiltered = true;
        console.log(`Filter exists : ${key} =  ${value}`);

        if (!filteredData) {
          filteredData = this.employees;
          console.log('only one time setup, intial count : ' + filteredData.length);
        }

        switch (key) {
          case 'id':
            filteredData = filteredData.filter((item) => {
              return value === item.id;
            });

            console.log(`Filtered length : ${key} =  ${filteredData.length}`);
            break;

          case 'username':
            filteredData = filteredData.filter((item) => {
              const searchStr = (item.username).toLowerCase();
              // console.log(searchStr + ': ' + value);
              return searchStr.startsWith(value);
            });

            console.log(`Filtered length : ${key} =  ${filteredData.length}`);
            break;

          case 'name':
            filteredData = filteredData.filter((item) => {
              const searchStr = (item.name).toLowerCase();
              // console.log(searchStr + ': ' + value);
              return searchStr.startsWith(value);
            });

            console.log(`Filtered length : ${key} =  ${filteredData.length}`);
            break;

          case 'role':
            filteredData = filteredData.filter((item) => {
              console.log(item.role + ': ' + value);
              return value.toLowerCase() === item.role;
            });

            console.log(`Filtered length : ${key} =  ${filteredData.length}`);
            break;
        }
      }
    });

    if (hasFilter) {
      if (filteredData) {
        this.filteredDatabase = new TalaDatabase(filteredData);
        this.dataSource = new TalaDatasource(
          this.filteredDatabase,
          this.paginator,
          this.sort,
          this.getActiveColumnForSorting);
        this.paginator._pageIndex = 0;
      }
    } else {
      this.clearFilter();
    }

  }

  getEmployees(): void {
    this.adminApiService.employees().subscribe(
      data => {
        console.log('No. of employees :', data.length);

        if (data.employees.length > 0) {
          const emps: any[] = data.employees;

          /*data.forEach(emp => {

            const role: string = emp['role'] ? emp['role']['role'] : '';

            // if (emps.length < 50) {
            emps.push(new Employee(emp['id'], emp['username'], this.titleCasePipe.transform(role)));
            // }
          });*/

          this.employees = emps;

          this.filteredDatabase = new TalaDatabase(emps);

          this.dataSource = new TalaDatasource(
            this.filteredDatabase,
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
      });
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
      case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
      case 'username': [propertyA, propertyB] = [a.username, b.username]; break;
      case 'role': [propertyA, propertyB] = [a.role, b.role]; break;
    }

    return [propertyA, propertyB];
  }

  clearFilter() {
    this.isFiltered = false;
    this.filterForm.reset();
    this.filteredDatabase = new TalaDatabase(this.employees);
    this.dataSource = new TalaDatasource(this.filteredDatabase,
      this.paginator, this.sort, this.getActiveColumnForSorting);
  }

}
