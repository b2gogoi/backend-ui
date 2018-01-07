import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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

  getVehicleTypes(): Observable<any> {
    return this.http.get('/server/rates').map((res: any) => res.json());
  }

  getDriverApplications(): Observable<any> {
    return this.http.get('/server/driver-applications').map((res: any) => res.json());
  }

  updateDriverApplication(id: number, driver: any): Observable<any> {
    return this.http.put(`/server/driver-applications/${id}`, driver).map((res: any) => res.json());
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

}
