import { Component, Input } from '@angular/core';
import { Producto } from '../../models/product.model';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [UpperCasePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

@Input({ required: true }) producto!: Producto; //se enviará un objeto de tipo Producto desde el componenten PADRE

cargarImagenDefault() {
  this.producto.imageUrl = 'images/producto_default.jpg';
}

}
