import {RouterModule, Routes} from '@angular/router';
import {ProductListComponent} from '../components/product-list/product-list.component';
import {NgModule} from '@angular/core';
import {ProductDetailsComponent} from '../components/product-details/product-details.component';
import {CartDetailsComponent} from '../components/cart-details/cart-details.component';
import {CheckoutComponent} from '../components/checkout/checkout.component';


import {
  OktaAuthGuard,
  OktaCallbackComponent
} from '@okta/okta-angular';

import {LoginComponent} from '../components/login/login.component';
import {MembersComponent} from '../components/members/members.component';
import {OrderHistoryComponent} from '../components/order-history/order-history.component';
import {NotFoundComponent} from '../components/not-found/not-found.component';


const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard]},
  {path: 'members', component: MembersComponent, canActivate: [OktaAuthGuard]},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id/:name', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent, pathMatch: 'full'},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
