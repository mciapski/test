import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();


  constructor() { }

  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {

    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;

    }

    // check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(theCartItem)
    }

    // compute cart totatl price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totatPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totatPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    // This will publish events to all subscribers

    this.totalPrice.next(totatPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes

    this.logCartData(totatPriceValue, totalQuantityValue);

  }

  logCartData(totatPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log('name: ' + tempCartItem.name + ", unitPrice: " + tempCartItem.unitPrice + ", quantity: " + tempCartItem.quantity + ", subTotalPrice: " + subTotalPrice);
    }

    console.log("totalPrice: " + totatPriceValue.toFixed(2) + ", totalQuantity: " + totalQuantityValue);
    console.log("---");

  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
// get index of item in the array
const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );

// if found, remove the item from the array at the given index
if (itemIndex > -1) {
  this.cartItems.splice(itemIndex, 1);

  this.computeCartTotals();
}
  }
}
