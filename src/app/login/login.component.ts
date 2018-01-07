import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Tabs } from '../tabs.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginModel: any;

  constructor(public authService: AuthService,
              private router: Router,
              public snackBar: MatSnackBar,
              private fb: FormBuilder) {

    this.loginModel = {};
    this.loginForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  private getTabsForRole(role: string): Tabs[] {
    let tabs: Tabs[];
      tabs = [
        new Tabs('Dashboard', '/dashboard', 'dashboard'),
        new Tabs('Driver Applications', '/applications', 'applications'),
        new Tabs('Firebase Upload', '/firebase', 'firebase'),
        new Tabs('Drivers', '/drivers', 'drivers')
      ];

    return tabs;
  }

  login(loginModel: any): boolean {
    console.log('you submitted value:', loginModel);
    const homeUrl = '/dashboard';

    this.authService.login(loginModel.username, loginModel.password).subscribe(
      data => {
        console.log('Received token : ', data.token);
        localStorage.setItem('token', data.token);
        // localStorage.setItem('role', data.roleName);
        localStorage.setItem('username', loginModel.username);

        const tabs = this.getTabsForRole(data.roleName);
        this.authService.sendMessage(tabs);

        localStorage.setItem('tabs', JSON.stringify(tabs));

        console.log(`LoginComponent : login successful so redirecting to ${homeUrl}`);
        this.router.navigate([homeUrl]);
      },
      err => {
        this.openSnackBar('Incorrect credentials.', null);
      }
    );
    return false;
  }

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      announcementMessage: 'Error'
    });
  }
/*

  public getErrorMessage() {
    return this.loginForm.controls.password.hasError('minLength') ? 'You must enter a password'
      : this.loginForm.controls.password.hasError('required') ? `Password should be atleast ${this.minPwdLength} chars`
        : '';
  }
*/

}
