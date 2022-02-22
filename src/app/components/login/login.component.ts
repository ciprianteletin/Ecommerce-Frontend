import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import * as OktaSignIn from '@okta/okta-signin-widget';

import AuthConfig from '../../config/auth-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      features: {
        registration: true
      },
      baseUrl: AuthConfig.oidc.issuer.split('/oauth2')[0],
      clientId: AuthConfig.oidc.clientId,
      redirectUri: AuthConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: AuthConfig.oidc.issuer,
        scopes: AuthConfig.oidc.scopes
      }
    });
  }

  ngOnInit(): void {
    this.oktaSignin.remove();
    this.oktaSignin.renderEl({
        el: '#okta-sign-in-widget' //id of the html div
      },
      (response: { status: string; }) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }

}
