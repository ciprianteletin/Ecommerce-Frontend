import {Component, OnInit} from '@angular/core';
import {GetResponseProduct, ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';
import {Page} from '../../common/page';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number;
  previousCategoryId: number;
  currentCategoryName: string;

  searchMode: boolean;
  previousKeyword = '';
  page: Page = new Page();

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  private handleSearchProducts(): void {
    const searchKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (searchKeyword !== this.previousKeyword) {
      this.page.thePageNumber = 1;
    }

    this.previousKeyword = searchKeyword;

    this.productService.searchProductsPaginate(this.page.thePageNumber - 1, this.page.thePageSize, searchKeyword)
      .subscribe(this.processResult());
  }

  private handleListProducts(): void {
    // check if id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.page = new Page();
    }

    this.previousCategoryId = this.currentCategoryId;

    // Angular will reuse this component, so if we have a different category, we should reset the page details;

    this.productService.getProductListPaginate(
      this.page.thePageNumber - 1,
      this.page.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult());
  }

  private processResult(): (data: GetResponseProduct) => void {
    return data => {
      this.products = data._embedded.products;
      this.page.thePageNumber = data.page.number + 1;
      this.page.thePageSize = data.page.size;
      this.page.totalElements = data.page.totalElements;
    };
  }

  updatePageSize(value: string): void {
    this.page.thePageSize = +value;
    this.page.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product): void {
    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }
}
