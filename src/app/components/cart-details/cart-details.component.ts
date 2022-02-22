import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit, OnDestroy {

  cartItems: CartItem[] = [];
  totalPrice = 0.00;
  totalQuantity = 0;

  totalQuantitySubscription: Subscription;
  totalPriceSubscription: Subscription;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  private listCartDetails(): void {
    this.cartItems = this.cartService.cartItems;

    this.totalPriceSubscription = this.cartService.totalPrice.subscribe(total => this.totalPrice = total);
    this.totalQuantitySubscription = this.cartService.totalQuantity.subscribe(quantity => this.totalQuantity = quantity);
  }

  incrementQuantity(tempCartItem: CartItem): void {
    this.cartService.addToCart(tempCartItem);
  }

  decrementQuantity(tempCartItem: CartItem): void {
    this.cartService.decrementQuantity(tempCartItem);
  }

  ngOnDestroy(): void {
    this.totalPriceSubscription.unsubscribe();
    this.totalQuantitySubscription.unsubscribe();
  }

  remove(tempCartItem: CartItem): void {
    this.cartService.removeItem(tempCartItem);
  }
}
