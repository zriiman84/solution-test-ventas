import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, NgControl, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Producto } from '../../../shared/models/producto.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { BaseResponse } from '../../../shared/models/generic.model';

@Component({
  selector: 'app-delete-product-dialog',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './delete-product-dialog.html',
  styleUrl: './delete-product-dialog.css',
})
export class DeleteProductDialog implements OnInit {

  data = inject(MAT_DIALOG_DATA) as Producto;
  dialogRef = inject(DialogRef);

  private productService = inject(ProductService);

  // Propiedades para la gestión de la imagen
  imageUrl: string | ArrayBuffer | null = '*';
  fileName: string = 'Ningún archivo seleccionado';

  imageFile: FormControl = new FormControl(null);

  ngOnInit() {
    this.cargarImagen(this.data.imageUrl);
  }

  deleteProduct() {
    const id = this.data.id.toString();

    this.productService.deleteProduct(id).subscribe((resp: BaseResponse) => {
      if (resp.success) {
        alert('¡Producto eliminado exitosamente! - Id Producto: ' + id);
        this.cerrarVentana();
      }
    });
  }

  cargarImagen(urlImagen: string | null) {
    if (!urlImagen) return;

    // 1. Establecer la URL para la previsualización
    this.imageUrl = urlImagen;

    // 2. Obtener el nombre del archivo en base a la URL
    const arrayURL = urlImagen.split('/')!;
    this.fileName = arrayURL[arrayURL.length - 1];

    // 3. Indica que hay una imagen existente
    // El tipo de valor será un string y no un File
    this.imageFile.setValue(urlImagen);
  }

  cerrarVentana() {
    this.dialogRef.close();
  }
}
