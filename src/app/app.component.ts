import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './auth.service';
import { Tabs } from './tabs.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  tabs: Tabs[];
  message: any;
  subscription: Subscription;

  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  constructor(public authService: AuthService, private router: Router) {

    this.subscription = this.authService.getMessage().subscribe(
      message => {
        this.message = message;
      });
  }

  logout(): boolean {
    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }

}
