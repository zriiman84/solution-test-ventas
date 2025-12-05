import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { Router } from '@angular/router';

import { MatIcon } from '@angular/material/icon';
import { ProductService } from '../shared/services/product-service/product-service';
import { CategoryService } from '../shared/services/category-service/category-service';
import { UserService } from '../shared/services/user-service/user-service';
import { ApiCategoriaByFilterResponse, CategoriaProducto } from '../shared/models/categoria.model';
import { LoggedInHeader } from '../shared/components/logged-in-header/logged-in-header';
import { Footer } from '../shared/components/footer/footer';
import { ApiProductoResponse } from '../shared/models/producto.model';

@Component({
  selector: 'app-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    LoggedInHeader,
    Footer,
    MatIcon,
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private userService = inject(UserService);
  private router = inject(Router);

  categorias : CategoriaProducto[] = [];

  //REGEX para ingresar un entero positivo (stock)
  readonly regexEnteroPositivo = /^[0-9]+$/;

  //REGEX para Decimal(8, 2) --> price
  readonly regex_decimal_8_2 = /^(0|[1-9]\d{0,5})(\.\d{1,2})?$/;

  // Propiedades para la gestión de la imagen
  imageUrl: string | ArrayBuffer | null = '*';
  fileName: string = 'Ningún archivo seleccionado';
  validTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg'];
  maxSizeInMegabytes: number = 1;

  productForm!: FormGroup;

  ngOnInit() {
    //Si no está logueado se mostrará una alerta y se redireccionará al login
    if (!this.userService.getIsLoggedIn()) {
      alert('Debes iniciar sesión');
      this.router.navigateByUrl('/login');
      return;
    }

    //Si el rol no es Administrator se mostrará una alerta
    if (!(this.userService.getRole() === 'Administrator')) {
      alert('Únicamente los administradores pueden registrar productos.');
      this.userService.logout(false);
      return;
    }

    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', [Validators.maxLength(200)]),
      extendedDescription: new FormControl('', [Validators.maxLength(800)]),
      price: new FormControl('', [Validators.required, Validators.min(1) ,Validators.pattern(this.regex_decimal_8_2)]),
      stock: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(this.regexEnteroPositivo),
      ]),
      productCategory: new FormControl('0', [Validators.required]), //selector
      imageFile: new FormControl(null), //imagen
    });

    //Obtener la lista de categorías de Producto
    this.cargarCategoriaProducto();

  }

  onFileSelected(event: Event) {
    // Tipado directo para acceder a .target.files
    const input = event.target as HTMLInputElement;

    // Revisamos si input existe y si tiene archivos
    if (!input || !input.files || input.files.length === 0) return;

    const file: File = input.files[0];

    //Validar tipo de archivo (opcional) -> Ya estoy controlando desde el html
    if (!this.validTypes.includes(file.type)) {
      this.productForm.controls['imageFile'].setErrors({ invalidType: true });
      this.resetValoresIniciales('Archivo seleccionado no válido.');
      return;
    }

    //Validar tamaño de archivo
    if (file.size > this.maxSizeInMegabytes * 1024 * 1024) {
      this.productForm.controls['imageFile'].setErrors({ maxSizeExceeded: true });
      this.resetValoresIniciales('Archivo seleccionado no válido.');
      return;
    }

    // 1. Almacena el archivo en el Form Control
    this.productForm.controls['imageFile'].setValue(file);
    this.productForm.controls['imageFile'].updateValueAndValidity();
    this.productForm.controls['imageFile'].markAsDirty();

    this.fileName = file.name;

    // 2. Muestra el preview de la imagen
    const reader = new FileReader();
    reader.onload = (e) => (this.imageUrl = reader.result as string);
    reader.readAsDataURL(file);

    // (Opcional)
    // Permitir la selección del mismo archivo inmediatamente después.
    input.value = '';
  }

  resetImage() {
    this.resetValoresIniciales('Ningún archivo seleccionado');
    this.productForm.controls['imageFile'].setValue(null);
    this.productForm.controls['imageFile'].markAsUntouched();
    this.productForm.controls['imageFile'].setErrors(null);
  }

  resetValoresIniciales(fileName : string) {
    this.fileName = fileName
    this.imageUrl = '*';
  }

  cargarCategoriaProducto(){
    return this.categoryService.getCategory(null).subscribe((resp : ApiCategoriaByFilterResponse) => {
      this.categorias = resp.Data ?? [];
    });
  }

  registerProduct() {

    const productData: FormData = new FormData();

    productData.append('Nombre', this.productForm.controls['name'].value!);
    productData.append('Descripcion', this.productForm.controls['description'].value);
    productData.append('DescripcionExtensa', this.productForm.controls['extendedDescription'].value);
    productData.append('PrecioUnitario', this.productForm.controls['price'].value!);
    productData.append('Image', this.productForm.controls['imageFile'].value); //Imagen cargada
    productData.append('Stock', this.productForm.controls['stock'].value!);
    productData.append('CategoriaProductoId', this.productForm.controls['productCategory'].value!);

    this.productService.addProduct(productData).subscribe((resp : ApiProductoResponse) => {
       alert('¡Registro de producto exitoso! - Id Producto: ' + resp.Data.toString());
        //this.router.navigateByUrl('/login');
        this.resetFormulario();
    });
  }

  resetFormulario(){

    //1. Resetear el formulario con valores iniciales del NgOnInit
    this.productForm.reset();

    //2. Recorrer cada control y marcarlo como "no tocado" (Untouched)
    //Esto remueve las clases CSS de error de Angular y oculta los mat-error.
    Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control) {
            control.markAsUntouched();
            control.markAsPristine();
        }
    });

    //3. Marcar el FormGroup completo como no tocado
    this.productForm.markAsUntouched();
    this.productForm.markAsPristine();

    this.resetImage();
  }

}
