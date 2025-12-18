import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { Router } from '@angular/router';
import { ApiCategoriaProductoRequest, ApiCategoriaResponse, CategoriaProducto } from '../../../shared/models/categoria.model';

@Component({
  selector: 'app-register-category',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register-category.html',
  styleUrl: './register-category.css',
})
export class RegisterCategory implements OnInit {

  private categoryService = inject(CategoryService);
  private router = inject(Router);
  categoryForm! : FormGroup;

  ngOnInit(): void {

    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', [Validators.maxLength(200)]),
    });
  }

  registerCategory(){

    const request: ApiCategoriaProductoRequest = {
      nombre:  this.categoryForm.controls['name'].value!,
      descripcion: this.categoryForm.controls['description'].value ?? null,
    }

    this.categoryService.addCategory(request).subscribe((resp: ApiCategoriaResponse) => {
      alert('¡Registro de nueva categoría exitoso! - Id Categoría: ' + resp.data.toString());
      this.router.navigateByUrl('/admin/category/list-category');
    });

  }

   resetFormulario(){

    //1. Resetear el formulario con valores iniciales del NgOnInit
    this.categoryForm.reset();

    //2. Recorrer cada control y marcarlo como "no tocado" (Untouched)
    Object.keys(this.categoryForm.controls).forEach(key => {
        const control = this.categoryForm.get(key);
        if (control) {
            control.markAsUntouched();
            control.markAsPristine();
        }
    });

    //3. Marcar el FormGroup completo como no tocado
    this.categoryForm.markAsUntouched();
    this.categoryForm.markAsPristine();
  }

}
