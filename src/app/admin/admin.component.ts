import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort } from '@angular/material';

import { AdminApiService } from '../admin-api.service';
import { Employee } from './employee.model';
import { EmployeeComponent } from './employee/employee.component';
import { Role } from './role.model';
import { TalaDatabase } from '../tala.database';
import { TalaDatasource } from '../tala.datasource';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  employees: Employee[];
  roles: Role[];
  duration: number;
  displayedColumns = ['id', 'username', 'role'];
  header: any = {};

  employeeDatabase: TalaDatabase = new TalaDatabase([]);

  dataSource: TalaDatasource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public adminApiService: AdminApiService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) { }

  openDialog(): void {
    const newUser: Employee = new Employee(-1, '', 'tala');

    const dialogRef = this.dialog.open(EmployeeComponent, {
      width: '600px',
      height: '90%',
      data: newUser
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed, driver : ', result);
        // this.createUser(result);

      } else {
        // User clicked 'Cancel' or clicked outside the dialog
      }
    });
  }

  createUser(newEmp: Employee): void {
    this.adminApiService
      .createEmployee(newEmp.username, newEmp.password)
      .subscribe(
    data => {
        console.log('Employee created :', data);

        const emp = data;

        let msg = `User ${newEmp.username} was created successfully`;

        this.adminApiService.assignRoleToEmployee(emp.id, newEmp.roleId)
        .subscribe(
          next => {
            console.log('Role assigned : ', next.role.role);
            msg += ' and role assigned';

            const role = next.role.role;
            emp.role = role;
            emp.roleId = next.role.id;
            this.employees.push(emp);
            this.employeeDatabase.dataChange.next(this.employees);
            this.openSnackBar(msg, null, this.duration);
          },
          err => {
            msg += ' but failed to assign role';
            this.employees.push(emp);
            this.employeeDatabase.dataChange.next(this.employees);

            this.openSnackBar(msg, null, this.duration);
          });

        },
        err => {
          this.openSnackBar(`Unable to create user: ${newEmp.username}`,
            null, this.duration);
        });
  }

  ngOnInit() {
    this.getRoles();
    this.getEmployees();
    this.duration = 2000;
    this.header['id'] = 'Id';
    this.header['username'] = 'Username';
    this.header['role'] = 'Role';
    console.log('AdminComponent');
  }

  getEmployees(): void {
    this.adminApiService.employees().subscribe(
      data => {
          console.log('No. of employees :', data.length);

          if (data.length > 0) {
            const emps: Employee[] = [];

            data.forEach(emp => {

              const role: string = null !== emp['role'] ? emp['role']['role'] : '';

              emps.push(new Employee(emp['id'], emp['username'], role));

            });

            this.employees = emps;

            this.employeeDatabase = new TalaDatabase(emps);
            this.dataSource = new TalaDatasource(
              this.employeeDatabase,
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

  getRoles(): void {
    if (localStorage.getItem('roles')) {
      this.roles = JSON.parse(localStorage.getItem('roles'));
      console.log('Roles found from localstorage:', this.roles.length);

    } else {
      this.adminApiService.roles().subscribe(
        data => {
          console.log('Roles found :', data.length);
          this.roles = data;
          localStorage.setItem('roles', JSON.stringify(data));
        },
        error => {
          console.log('Unable to fetch roles from server', error);
        }
      );
    }
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

}


