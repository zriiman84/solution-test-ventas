import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ApiCategoriaProductoRequest,
  ApiCategoriaResponse,
  CategoriaProducto,
} from '../../../shared/models/categoria.model';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../shared/services/category-service/category-service';

@Component({
  selector: 'app-edit-category-dialog',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './edit-category-dialog.html',
  styleUrl: './edit-category-dialog.css',
})
export class EditCategoryDialog implements OnInit {
  private categoryService = inject(CategoryService);
  data = inject(MAT_DIALOG_DATA) as CategoriaProducto;
  dialogRef = inject(DialogRef);

  categoryForm!: FormGroup;

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl(this.data.nombre, [Validators.required, Validators.maxLength(100)]),
      description: new FormControl(this.data.descripcion, [Validators.maxLength(200)]),
    });
  }

  editCategory() {
    const request: ApiCategoriaProductoRequest = {
      nombre: this.categoryForm.controls['name'].value!,
      descripcion: this.categoryForm.controls['description'].value ?? null,
    };

    this.categoryService
      .updateCategory(this.data.id.toString(), request)
      .subscribe((resp: ApiCategoriaResponse) => {
        alert('Categoría Modificada exitosamente! - Id Categoría: ' + resp.data.toString());
        this.cerrarVentana();
      });
  }

  cerrarVentana() {
    this.dialogRef.close();
  }
}

