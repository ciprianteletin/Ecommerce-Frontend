import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProductListComponent} from './components/product-list/product-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './modules/routing.module';
import {ProductCategoryMenuComponent} from './components/product-category-menu/product-category-menu.component';
import {SearchComponent} from './components/search/search.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {CartStatusComponent} from './components/cart-status/cart-status.component';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {LoginComponent} from './components/login/login.component';
import {LoginStatusComponent} from './components/login-status/login-status.component';
import {OKTA_CONFIG, OktaAuthModule} from '@okta/okta-angular';
import {Router} from '@angular/router';
import AuthConfig from './config/auth-config';
import {OktaAuth} from '@okta/okta-auth-js';
import {MembersComponent} from './components/members/members.component';
import {OrderHistoryComponent} from './components/order-history/order-history.component';
import {AuthInterceptorService} from './services/auth-interceptor.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FooterComponent } from './components/footer/footer.component';

const oktaConfig = Object.assign({
  onAuthRequired: (injector: { get: (arg0: typeof Router) => any; }) => {
    const router = injector.get(Router);

    router.navigate(['/login']);
  }
}, AuthConfig.oidc);

const oktaAuth = new OktaAuth(oktaConfig);

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersComponent,
    OrderHistoryComponent,
    NotFoundComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [{provide: OKTA_CONFIG, useValue: {oktaAuth}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
