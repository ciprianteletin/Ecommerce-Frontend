import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Purchase} from '../common/purchase';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {PaymentInfo} from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseURL = environment.apiUrl + '/checkout/purchase';
  private paymentIntentURL = environment.apiUrl + '/checkout/payment-intent';

  constructor(private httpClient: HttpClient) {
  }

  placeOrder(purchase: Purchase): Observable<any> {
    console.log(purchase);
    return this.httpClient.post<Purchase>(this.purchaseURL, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentURL, paymentInfo);
  }
}
