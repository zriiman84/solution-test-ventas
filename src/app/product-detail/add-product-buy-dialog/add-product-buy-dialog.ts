import { Component, inject } from '@angular/core';
import { VentaService } from '../../shared/services/venta-service/venta-service';
import { Router } from '@angular/router';
import { Producto } from '../../shared/models/producto.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

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

    console.log('DetalleVenta: ' + JSON.stringify(this.ventaService.getItemsVenta(), null, 2));

    //Cierro el modal
    this.dialogRef.close();
  }

}
