import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { LoanTerm } from './loan/loan-term.model';
import {ApprovalControl} from './approval-controls/approval-control.model';

@Injectable()
export class AdminApiService {

  constructor(private http: Http) {}

  getDriverDetails(id: number): Observable<any> {

    const queryUrl = `/server/driver/${id}`;

    return this.http.get(queryUrl)
      .map((response: Response) => {
        return (<any>response.json());
      });
  }

  getCurrentApprovalControl(): Observable<any> {

    const queryUrl = '/api/admin/approvalcontrol/current';

    return this.http.get(queryUrl)
      .map((response: Response) => {
        return (<any>response.json());
      });
  }

  updateApprovalControl(control: ApprovalControl): Observable<any> {
    return this.http.put('/api/admin/approvalcontrol/${controlId}', control).map((res: any) => res.json());
  }

  experiment(control: ApprovalControl): Observable<any> {
    const url = `/api/admin/approvalcontrol/experiments/${control.bound}/${control.operator}/${control.operand}`;
    return this.http.get(url).map((res: any) => res.json());
  }

  createEmployee(user: string, password: string): Observable<any> {

    const userObj = {
      'username': user,
      'password': password
    };

    return this.http.post('/api/admin/employees', userObj).map((res: any) => res.json());
  }

  assignRoleToEmployee(employeeId: number, roleId: number): Observable<any> {

    const roleObj = {
      'id': roleId
    };

    console.log('roleobj', roleObj);

    return this.http.post(`/api/admin/employees/${employeeId}/role`, roleObj).map((res: any) => res.json());
  }

  getCurrentLoanTerm(): Observable<any> {
    return this.http.get('/api/admin/loan-term/current').map((res: any) => res.json());
  }

  updateLoanTerm(loanTerm: LoanTerm): Observable<any> {
    return this.http.put('/api/admin/loan-term/current', loanTerm).map((res: any) => res.json());
  }

  createLoanTerm(loanTerm: LoanTerm): Observable<any> {
    return this.http.post('/api/admin/loan-term', loanTerm).map((res: any) => res.json());
  }

  getLoanTerms(): Observable<any> {
    return this.http.get('/api/admin/loan-term').map((res: any) => res.json());
  }

  getVehicleTypes(): Observable<any> {
    return this.http.get('/server/rates').map((res: any) => res.json());
  }

  getDriverApplications(): Observable<any> {
    return this.http.get('/server/driver-applications').map((res: any) => res.json());
  }

  updateDriverApplication(id: number, driver: any): Observable<any> {
    return this.http.put(`/server/driver-applications/${id}`, driver).map((res: any) => res.json());
  }

  getLoansDue(filterMap: any): Observable<any> {

    let queryUrl = `/api/admin/loans-due`;

    if (filterMap) {
      queryUrl += '?';
    }

    Object.keys(filterMap).forEach(key => {
      if (filterMap.hasOwnProperty(key)) {
        queryUrl += `${key}=${filterMap[key]}&`;
      }
    });

    return this.http.get(queryUrl)
      .map((response: Response) => {
        return (<any>response.json());
      });
  }

  updateVolumeControl(volumeCtrl: any): Observable<any> {
    return this.http.put('/server/driver-applications/', volumeCtrl).map((res: any) => res.json());
  }

  getDrivers(): Observable<any> {
    return this.http.get('/server/driver').map((res: any) => res.json());
  }

  getDriverTripHistory(id: number): Observable<any> {
    /*const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('accountId', '1');
    headers.append('token', 'IDA2BN5Pc54bM');*/

    /*const h = {
      headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
    }*/

    // const options = new RequestOptions({ headers: headers });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('accountId', '1');
    headers.append('token', 'IDA2BN5Pc54bM');

    const opts = new RequestOptions();
    opts.headers = headers;

    return this.http.get(`/server/driver/${id}/trips`, opts).map((res: any) => res.json());
  }

  getVolumeControl(): Observable<any> {
    return this.http.get('/api/admin/volume-control').map((res: any) => res.json());
  }

}
