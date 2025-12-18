import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiProductoResponse, Producto } from '../../../shared/models/producto.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import {
  ApiCategoriaByFilterResponse,
  CategoriaProducto,
} from '../../../shared/models/categoria.model';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-edit-product-dialog',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIcon,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-product-dialog.html',
  styleUrl: './edit-product-dialog.css',
})
export class EditProductDialog implements OnInit {

  data = inject(MAT_DIALOG_DATA) as Producto;
  dialogRef = inject(DialogRef);

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  categorias: CategoriaProducto[] = [];

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

    this.productForm = new FormGroup({
      name: new FormControl(this.data.nombre, [Validators.required, Validators.maxLength(100)]),
      description: new FormControl(this.data.descripcion, [Validators.maxLength(200)]),
      extendedDescription: new FormControl(this.data.descripcionExtensa, [Validators.maxLength(800)]),
      price: new FormControl(this.data.precioUnitario.toFixed(2), [
        Validators.required,
        Validators.min(1),
        Validators.pattern(this.regex_decimal_8_2),
      ]),
      stock: new FormControl(this.data.stock, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(this.regexEnteroPositivo),
      ]),
      productCategory: new FormControl(this.data.categoriaProductoId, [Validators.required]), //selector
      imageFile: new FormControl(null), //sipre debe inicializar con null
    });


    this.cargarCategoriaProducto();
    this.cargarImagen(this.data.imageUrl);
  }

  cargarCategoriaProducto() {
    return this.categoryService
      .getCategory(null)
      .subscribe((resp: ApiCategoriaByFilterResponse) => {
        this.categorias = resp.data ?? [];
      });
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

  resetValoresIniciales(fileName: string) {
    this.fileName = fileName;
    this.imageUrl = '*';
  }

  editProduct() {
    const productData: FormData = new FormData();

    productData.append('Nombre', this.productForm.controls['name'].value!);
    productData.append('Descripcion', this.productForm.controls['description'].value);
    productData.append('DescripcionExtensa',this.productForm.controls['extendedDescription'].value);
    productData.append('PrecioUnitario', this.productForm.controls['price'].value!);
    productData.append('Stock', this.productForm.controls['stock'].value!);
    productData.append('CategoriaProductoId', this.productForm.controls['productCategory'].value!);

    const imagenData = this.productForm.controls['imageFile'].value;

    if(imagenData instanceof File){
      // El usuario seleccionó un nuevo archivo. Enviar el objeto File al backend
      productData.append('Image', imagenData);
    }

    this.productService.updateProduct(this.data.id.toString(),productData).subscribe((resp: ApiProductoResponse) => {
      alert('¡Producto Modificado exitosamente! - Id Producto: ' + resp.data.toString());
      this.cerrarVentana();
    });
  }

  cerrarVentana() {
    this.dialogRef.close();
  }

  cargarImagen (urlImagen: string | null){

    if(!urlImagen) return;

    // 1. Establecer la URL para la previsualización
    this.imageUrl = urlImagen;

    // 2. Obtener el nombre del archivo en base a la URL
    const arrayURL = urlImagen.split("/")!;
    this.fileName = arrayURL[arrayURL.length -1];

    // 3. Indica que hay una imagen existente
    this.productForm.controls['imageFile'].setValue(urlImagen);

  }
}
