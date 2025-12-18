import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { ShoppingCarService } from '../../services/shopping-car-service/shopping-car-service';

@Component({
  selector: 'app-add-product-buy-dialog',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './add-product-buy-dialog.html',
  styleUrl: './add-product-buy-dialog.css',
})
export class AddProductBuyDialog {

  private carService = inject(ShoppingCarService);

  private router = inject(Router);

  // Desde "product-detail" recibiré un objeto de tipo Producto.
  data = inject(MAT_DIALOG_DATA) as Producto;

  private dialogRef = inject(DialogRef);

  addProductToShoppingCar(cantidad: number){

    //Validar stock
     if(cantidad > this.data.stock){
      alert('La cantidad solicitada del producto es mayor al stock disponible.');
      this.dialogRef.close();
      return;
    }

    //Agregar el producto en memoria persistente
    this.carService.addItem({
      productoId: this.data.id,
      cantidad: cantidad,
    });

    //Cierro el modal
    this.dialogRef.close();
  }

}
