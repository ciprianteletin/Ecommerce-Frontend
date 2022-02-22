import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {Subscriber, Subscription} from 'rxjs';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit, OnDestroy {

  totalPrice = 0.00;
  totalQuantity = 0;

  totalQuantitySubscription: Subscription;
  totalPriceSubscription: Subscription;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  private updateCartStatus(): void {
    this.totalQuantitySubscription = this.cartService.totalQuantity.subscribe(quantity => this.totalQuantity = quantity);
    this.totalPriceSubscription = this.cartService.totalPrice.subscribe(price => this.totalPrice = price);
  }

  ngOnDestroy(): void {
    this.totalPriceSubscription.unsubscribe();
    this.totalQuantitySubscription.unsubscribe();
  }
}
