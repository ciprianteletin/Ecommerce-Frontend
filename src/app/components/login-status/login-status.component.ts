import {Component, Inject, OnInit} from '@angular/core';
import {OktaAuth} from '@okta/okta-auth-js';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean | undefined = false;
  userFullName: string | undefined;
  storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
  }

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
      }
    );
  }

  private getUserDetails(): void {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        res => {
          this.userFullName = res.name;
          this.storage.setItem('userEmail', JSON.stringify(res.email));
        }
      );
    }
  }

  logout(): void {
    this.oktaAuth.signOut();
    this.storage.removeItem('userEmail');
  }

}
