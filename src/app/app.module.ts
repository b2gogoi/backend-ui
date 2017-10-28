import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
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

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
      path: 'dashboard',
      component: HomeComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'dashboard/customer/:id',
      component: CustomerComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'loan-terms',
      component: LoanComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'approval-controls',
      component: ApprovalControlsComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'volume-controls',
      component: VolumeControlComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'loans-due',
      component: LoansDueComponent,
      canActivate: [LoggedInGuard]
    },
    {
      path: 'admin-access',
      component: AdminComponent,
      canActivate: [LoggedInGuard]
    },
    { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [
    LanguagePipe,
    PhonePipe,
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
    LoansDueComponent
  ],
  entryComponents: [EmployeeComponent, ExperimentComponent, LoanTermComponent, LoanApplicationComponent],
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
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatExpansionModule,
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
