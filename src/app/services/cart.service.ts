import {Injectable} from '@angular/core';
import {CartItem} from '../common/cart-item';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage = localStorage;

  constructor() {
    const item = this.storage.getItem('cartItems');
    if (item != null) {
      const data = JSON.parse(item);
      if (data != null) {
        this.cartItems = data;
        this.computeCartTotals();
      }
    }
  }

  addToCart(cartItem: CartItem): void {
    let alreadyExistsInCart = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(item => item.id === cartItem.id);
      alreadyExistsInCart = (existingCartItem !== undefined);
    }

    if (alreadyExistsInCart) {
      // @ts-ignore
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals(): void {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (const currentCartItem of this.cartItems) {
      totalQuantityValue += currentCartItem.quantity;
      totalPriceValue += currentCartItem.total;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.persistCartItems();
  }

  persistCartItems(): void {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  decrementQuantity(tempCartItem: CartItem): void {
    if (tempCartItem.quantity > 1) {
      tempCartItem.quantity--;
    } else {
      this.removeItem(tempCartItem);
    }
  }

  removeItem(tempCartItem: CartItem): void {
    const index = this.cartItems.findIndex(item => item.id === tempCartItem.id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.computeCartTotals();
    }
  }
}
