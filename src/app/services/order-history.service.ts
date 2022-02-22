import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OrderHistory} from '../common/order-history';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private orderURL = environment.apiUrl + '/orders';

  constructor(private httpClient: HttpClient) {
  }

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderURL}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
}