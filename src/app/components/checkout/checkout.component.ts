import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormDetailsService} from '../../services/form-details.service';
import {City, Country, CountryStateService, State} from '../../services/country-state.service';
import {WhitespaceValidator} from '../../validators/whitespace-validator';
import {CartService} from '../../services/cart.service';
import {Subscription} from 'rxjs';
import {CheckoutService} from '../../services/checkout.service';
import {Router} from '@angular/router';
import {Order} from '../../common/order';
import {OrderItem} from '../../common/order-item';
import {Purchase} from '../../common/purchase';
import {environment} from '../../../environments/environment';
import {PaymentInfo} from '../../common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutFormGroup: FormGroup;
  totalPrice = 0;
  totalPriceSubscription: Subscription;
  totalQuantity = 0;
  totalQuantitySubscription: Subscription;

  storage = sessionStorage;
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any;

  countries: Country[];
  addressState: State[];
  billingState: State[];

  addressCity: City[];
  billingCity: City[];

  isDisabled = false;

  constructor(private formBuilder: FormBuilder,
              private formService: FormDetailsService,
              private countryStateService: CountryStateService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.setupStripePaymentForm();

    const email = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidator.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidator.notOnlyWhitespace]),
        email: new FormControl(email, [Validators.required,
          Validators.pattern('^[a-z09._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidator.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidator.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({}),
    });

    this.countryStateService.initCountries()
      .subscribe(data => this.countries = data);

    this.reviewCartDetails();
  }

  copyShippingAddressToBillingAddress(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingState = this.addressState;
      this.billingCity = this.addressCity;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingState = [];
      this.billingCity = [];
    }
  }

  private reviewCartDetails(): void {
    this.totalQuantitySubscription = this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
    this.totalPriceSubscription = this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
  }

  onSubmit(): void {
    if (this.checkoutFormGroup.invalid) {
      console.log(this.checkoutFormGroup.errors);
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    const order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    const orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item));

    const purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls.customer.value;

    purchase.shippingAddress = this.checkoutFormGroup.controls.shippingAddress.value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    const shippingCity: City = JSON.parse(JSON.stringify(purchase.shippingAddress.city));
    purchase.shippingAddress.state = shippingState.state_name;
    purchase.shippingAddress.country = shippingCountry.country_name;
    purchase.shippingAddress.city = shippingCity.city_name;

    purchase.billingAddress = this.checkoutFormGroup.controls.billingAddress.value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    const billingCity: City = JSON.parse(JSON.stringify(purchase.billingAddress.city));
    purchase.billingAddress.state = billingState.state_name;
    purchase.billingAddress.country = billingCountry.country_name;
    purchase.billingAddress.city = billingCity.city_name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';

    this.isDisabled = true;
    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === '') {
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                email: purchase.customer.email,
                name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                address: {
                  line1: purchase.billingAddress.street,
                  city: purchase.billingAddress.city,
                  state: purchase.billingAddress.state,
                  postal_code: purchase.billingAddress.zipCode,
                  country: purchase.billingAddress.country
                }
              }
            }
          }, {handleActions: false})
            // @ts-ignore
            // tslint:disable-next-line:typedef
            .then(function(result) {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
                // @ts-ignore
                this.isDisabled = false;
              } else {
                // @ts-ignore
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: { orderTrackingNumber: any; }) => {
                    alert(`Your order has been received. \n Order tracking number: ${response.orderTrackingNumber}`);
                    // @ts-ignore
                    this.resetCart();
                    // @ts-ignore
                    this.isDisabled = false;
                  },
                  error: (err: { message: any; }) => {
                    alert(`There was an error: ${err.message}`);
                    // @ts-ignore
                    this.isDisabled = false;
                  }
                });
              }
            }.bind(this));
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  private setupStripePaymentForm(): void {
    const elements = this.stripe.elements();

    this.cardElement = elements.create('card', {hidePostalCode: true});

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }

  private resetCart(): void {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
  }

  getStates(formGroupName: string): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryName = formGroup?.value.country.country_name;

    this.countryStateService.getStates(countryName)
      .subscribe(data => {
        if (formGroupName === 'shippingAddress') {
          this.addressState = data;
        } else {
          this.billingState = data;
        }
      });
  }

  getCity(formGroupName: string): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const stateName = formGroup?.value.state.state_name;

    this.countryStateService.getCities(stateName)
      .subscribe(data => {
        if (formGroupName === 'shippingAddress') {
          this.addressCity = data;
        } else {
          this.billingCity = data;
        }
        formGroup?.get('city')?.setValue(data[0]);
      });
  }

  get firstName(): AbstractControl | null {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(): AbstractControl | null {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(): AbstractControl | null {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCountry(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressState(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressCity(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressZipCode(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressCountry(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressCity(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressStreet(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressZipCode(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  ngOnDestroy(): void {
    this.totalPriceSubscription.unsubscribe();
    this.totalQuantitySubscription.unsubscribe();
  }
}
