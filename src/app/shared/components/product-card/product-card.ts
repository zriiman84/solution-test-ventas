import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-product-card',
  imports: [UpperCasePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

@Input({ required: true }) dataProducto!: Producto; //se enviará un objeto de tipo Producto desde el componenten PADRE

cargarImagenDefault() {
  this.dataProducto.imageUrl = 'images/imagen_no_disponible.jpg';
}

}
