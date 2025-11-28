import { Component } from '@angular/core';
import { LoggedInHeader } from '../shared/components/logged-in-header/logged-in-header';

@Component({
  selector: 'app-product-detail',
  imports: [LoggedInHeader],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {

}
