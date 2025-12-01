import { Component, inject } from '@angular/core';
import { HomeHeader } from './home-header/home-header';
import { Footer } from '../shared/components/footer/footer';
import { ProductCard } from '../shared/components/product-card/product-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Producto } from '../shared/models/producto.model';
import { CategoriaProducto } from '../shared/models/categoria.model';
import { HomeService } from './home-service/home-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiHomeResponse } from '../shared/models/api-home.model';
import { ProductService } from '../shared/services/product-service/product-service';
import { ResaltarProductCard } from '../shared/directives/home-directive/resaltar-product-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HomeHeader, ProductCard, Footer, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, ResaltarProductCard, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private homeService : HomeService;
  private productService: ProductService;
  categorias: CategoriaProducto[] = [];
  private productosIniciales: Producto[] = [];
  productosFiltrados: Producto[] = []; //arreglo de productos filtrados por búsqueda

  private categoriaSeleccionadaId: number = 0;
  private valorBusquedaProducto: string = '';
  categoriaControl = new FormControl(0);   //Selector de categoría de producto

  constructor(){
    this.homeService = inject(HomeService);
    this.productService = inject(ProductService);
  }

  ngOnInit(){

    //cargar data inicial de categorías y productos
    this.cargarDataInicial();

    //Capturar el valor de la categoría seleccionada y filtrar productos
    	this.categoriaControl.valueChanges.subscribe((value: number | null) => {
      	console.log('Home - Id categoría Seleccionada: ', value);
        this.categoriaSeleccionadaId = value?? 0;  //asignarle el valor seleccionado o 0 (en caso de nulo)
      	this.filtrarProductos();				           //filtrar los productos en base a filtros
    	});
  }

  cargarDataInicial(){
    this.homeService.getHomeData().subscribe((data : ApiHomeResponse) => {
      this.categorias = data.categorias?? [];          //Cargo todoas las categorías
      this.productosIniciales = data.productos?? [];  //Cargo todos los productos
      this.productosFiltrados = this.productosIniciales;          //Inicialmente los productos filtrados serán todos los productos
    });
  }

  filtrarProductos(){
    this.filtrarPorCategoria();
    this.filtrarPorNombre();
  }

  filtrarPorCategoria(){
    if(this.categoriaSeleccionadaId === 0){
      this.productosFiltrados = this.productosIniciales;
    }else{
      this.productosFiltrados = this.productosIniciales.filter(p => p.CategoriaProductoId === this.categoriaSeleccionadaId);
    }
  }

  filtrarPorNombre(){
    //Búsqueda óptima en memoria, en base al universo de productos iniciales
    if(!this.valorBusquedaProducto)return;
    this.productosFiltrados = this.productosFiltrados.filter(p => p.Nombre.toLowerCase().includes(this.valorBusquedaProducto.toLowerCase()));
  }

  //Búsqueda por valor ingresado - Se ejecuta desde el componente hijo HomeHeader y se realiza una petición por cada dígito ingresado
  obtenerProductos(valorBusqueda: string) {
    this.valorBusquedaProducto = valorBusqueda;
    this.filtrarProductos();
  }

  //Búsqueda por api endpoint - No es óptimo para cada dígito ingresado
  obtenerProductosPorNombre(nombre: string){
    this.productService.getProductByNombre(nombre).subscribe((response) => {
      this.productosFiltrados = response.Data ?? [];
    });
  }

}
