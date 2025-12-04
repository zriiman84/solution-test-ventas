import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta-service/venta-service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-add-product-buy-dialog',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './add-product-buy-dialog.html',
  styleUrl: './add-product-buy-dialog.css',
})
export class AddProductBuyDialog {

  private ventaService = inject(VentaService);

  private router = inject(Router);

  // Desde "product-detail" recibiré un objeto de tipo Producto.
  data = inject(MAT_DIALOG_DATA) as Producto;

  private dialogRef = inject(DialogRef);

  addProductToShoppingCar(cantidad: number){

    //Agregar el producto en memoria persistente
    this.ventaService.addItemVenta({
      ProductoId: this.data.Id,
      Cantidad: cantidad,
    });

    //Cierro el modal
    this.dialogRef.close();
  }

}
