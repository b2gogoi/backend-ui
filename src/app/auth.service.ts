import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import { Tabs } from './tabs.model';

@Injectable()
export class AuthService {

  private subject = new Subject<any>();

  sendMessage(message: Tabs[]) {
    this.subject.next({ data: message });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  constructor(private http: Http) {}

  permissions(): Observable<any> {

      const queryUrl = '/api/admin/permissions';

      return this.http.get(queryUrl)
      .map((response: Response) => {
        return (<any>response.json());
      });
    }

    login(user: string, password: string): Observable<any> {

      const userObj = {
        'username': user,
        'password': password
      };

      return this.http.post('/server/admin-user/token', userObj).map((res: any) => res.json());
    }

    logout(): any {
      console.log('logout');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
      localStorage.removeItem('tabs');
      localStorage.removeItem('loan-terms');
    }

    getUser(): string {

      return localStorage.getItem('username');
    }

    getRole(): string {

      return localStorage.getItem('role');
    }

    isLoggedIn(): boolean {
      // console.log('AuthService - isLoggedIn()');
      return null !== this.getUser();
    }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService}
];
