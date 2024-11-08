import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject, Subscription } from 'rxjs';
import { User } from './user.model';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'shopping-list';
  loggedIn = false;
  private subscriptions: Subscription[] = [];

  constructor(private auth: AuthService) {
    this.loggedIn = this.auth.getUser() != null;
  }
  
  ngOnInit(): void {
    console.log("apiurl:" + environment.apiUrl);
    this.subscriptions.push(this.auth.loginSuccess.subscribe({
      next: (user) => {
        this.loggedIn = true;
      }
    }));

    this.subscriptions.push(this.auth.logoutSuccess.subscribe({
      next: () => {
        this.loggedIn = false;
      }
    }))
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  logout() {
    console.log("logout");
    this.auth.logout();
  }
}
