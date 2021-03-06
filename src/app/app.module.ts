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
  MatInputModule, MatListModule, MatMenuModule,
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

import { PhonePipe } from './phone.pipe';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AUTH_PROVIDERS } from './auth.service';
import { LoggedInGuard } from './logged-in.guard';
import { AdminApiService } from './admin-api.service';
import { DatePipe } from '@angular/common';
import { DownloadCsvComponent } from './download-csv/download-csv.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { DriversComponent } from './drivers/drivers.component';
import { VehiclePipe } from './vehicle.pipe';
import { DriverComponent } from './drivers/driver/driver.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { ReferralComponent } from './referral/referral.component';
import { StatIconComponent } from './components/stat-icon/stat-icon.component';
import { CurrencyPipe } from './currency.pipe';
import { PaymentsComponent } from './payments/payments.component';
import { TripsComponent } from './trips/trips.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { TypeComponent } from './vehicle-type/type/type.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './admin/user/user.component';
import { ApplComponent } from './home/appl/appl.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'admin',
      component: AdminComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'applications',
      component: HomeComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'referral-stats',
      component: ReferralComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'payments',
      component: PaymentsComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'vehicle-type',
      component: VehicleTypeComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'applications/driver/:id',
      component: EmployeeComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'drivers',
      component: DriversComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'trips',
      component: TripsComponent,
      canActivate: [LoggedInGuard]
    },
    { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [
    PhonePipe,
    VehiclePipe,
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    DownloadCsvComponent,
    EmployeeComponent,
    DriverComponent,
    DriversComponent,
    DocumentsComponent,
    ReferralComponent,
    StatIconComponent,
    CurrencyPipe,
    PaymentsComponent,
    TripsComponent,
    VehicleTypeComponent,
    TypeComponent,
    AdminComponent,
    UserComponent,
    ApplComponent
  ],
  entryComponents: [EmployeeComponent, DriverComponent, TypeComponent, UserComponent, ApplComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    // NgbModule.forRoot(),
    BrowserAnimationsModule,
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
    MatListModule,
    MatMenuModule,
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
