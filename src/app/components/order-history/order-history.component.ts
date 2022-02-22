import {Component, OnInit} from '@angular/core';
import {OrderHistoryService} from '../../services/order-history.service';
import {OrderHistory} from '../../common/order-history';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {
  }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  private handleOrderHistory(): void {
    const email = JSON.parse(this.storage.getItem('userEmail')!);
    console.log(email);
    this.orderHistoryService.getOrderHistory(email)
      .subscribe(data => {
        console.log(data);
        this.orderHistoryList = data._embedded.orders;
        }
      );
  }
}
