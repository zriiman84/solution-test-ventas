import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { CategoriaProducto } from '../../../shared/models/categoria.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { BaseResponse } from '../../../shared/models/generic.model';

@Component({
  selector: 'app-delete-category-dialog',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './delete-category-dialog.html',
  styleUrl: './delete-category-dialog.css',
})
export class DeleteCategoryDialog {
  private categoryService = inject(CategoryService);
  data = inject(MAT_DIALOG_DATA) as CategoriaProducto;
  dialogRef = inject(DialogRef);

  deleteCategory() {
    const id = this.data.id.toString();

    this.categoryService.deleteCategory(id).subscribe((resp: BaseResponse) => {
      if (resp.success) {
        alert('Categoría eliminada exitosamente! - Id Categoria: ' + id);
        this.cerrarVentana();
      }
    });
  }

  cerrarVentana() {
    this.dialogRef.close();
  }
}
