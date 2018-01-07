import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatCardModule, MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

import { LanguagePipe } from './language.pipe';
import { PhonePipe } from './phone.pipe';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AUTH_PROVIDERS } from './auth.service';
import { LoggedInGuard } from './logged-in.guard';
import { AdminApiService } from './admin-api.service';
import { AdminComponent } from './admin/admin.component';
import { LoanComponent } from './loan/loan.component';
import { EmployeeComponent } from './admin/employee/employee.component';
import { LoanTermComponent } from './loan/loan-term/loan-term.component';
import { ApprovalControlsComponent } from './approval-controls/approval-controls.component';
import { ExperimentComponent } from './approval-controls/experiment/experiment.component';
import { CustomerComponent } from './home/customer/customer.component';
import { LoanApplicationComponent } from './home/customer/loan-application/loan-application.component';
import { VolumeControlComponent } from './volume-control/volume-control.component';
import { DownloadCsvComponent } from './download-csv/download-csv.component';
import { DatePipe } from '@angular/common';
import { LoansDueComponent } from './loans-due/loans-due.component';
import { DriversComponent } from './drivers/drivers.component';
import {VehiclePipe} from './vehicle.pipe';
import {DriverComponent} from './drivers/driver/driver.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FirebaseStorageComponent } from './firebase-storage/firebase-storage.component';
import {firebaseConfig} from '../environments/firebase.config';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [LoggedInGuard]
    },
    /*{
      path: 'firebase',
      component: FirebaseStorageComponent,
      canActivate: [LoggedInGuard]
    },*/
    {
      path: 'applications',
      component: HomeComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'dashboard/customer/:id',
      component: CustomerComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'drivers',
      component: DriversComponent,
      canActivate: [LoggedInGuard]
    },
    { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [
    LanguagePipe,
    PhonePipe,
    VehiclePipe,
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    LoanComponent,
    EmployeeComponent,
    LoanTermComponent,
    ApprovalControlsComponent,
    ExperimentComponent,
    CustomerComponent,
    LoanApplicationComponent,
    VolumeControlComponent,
    DownloadCsvComponent,
    LoansDueComponent,
    DriverComponent,
    DriversComponent,
    DashboardComponent,
    FirebaseStorageComponent
  ],
  entryComponents: [EmployeeComponent, ExperimentComponent, LoanTermComponent, LoanApplicationComponent, DriverComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    // NgbModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],

  providers: [AUTH_PROVIDERS, AdminApiService, LoggedInGuard, DatePipe],

  bootstrap: [AppComponent]
})

export class AppModule { }
