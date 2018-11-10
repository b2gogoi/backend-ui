import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, Router
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { Tabs } from './tabs.model';
import {AdminApiService} from './admin-api.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private authService: AuthService,
              private adminService: AdminApiService,
              private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const url: string = state.url;
    const homeUrl = '/dashboard';

    console.log('Can Activate called fo url: ', url);

    const isLoggedIn = this.authService.isLoggedIn();
    console.log('canActivate: ', isLoggedIn);

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      console.log('Not logged so redirected to /login');

    } else {
      const username = localStorage.getItem('username');
      this.adminService.setAuths(username);
      const role = this.authService.getRole();
      console.log('role: ', role);

      const tabs: Tabs[] = JSON.parse(localStorage.getItem('tabs'));
      this.authService.sendMessage(tabs);

      console.log('resetting the tabs', tabs);

      let allowed = false;

      tabs.forEach(tab => {
        if (url === tab.link || url.startsWith(tab.link)) {
          allowed = true;
        }
      });

      // if (url !== homeUrl && role !== 'admin' && role !== 'master') {
      if (url !== homeUrl && !allowed ) {
        this.router.navigate([homeUrl]);
        console.log(`Not authorized, redirected to ${homeUrl}`);
        return false;
      }
    }

    return isLoggedIn;
  }
}
