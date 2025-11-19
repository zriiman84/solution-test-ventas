import { Component } from '@angular/core';
import { HomeHeader } from './home-header/home-header';
import { Footer } from '../shared/components/footer/footer';
import { ProductCard } from '../shared/components/product-card/product-card';
import { Producto } from '../shared/models/product.model';
<<<<<<< HEAD

@Component({
  selector: 'app-home',
  imports: [HomeHeader,ProductCard,Footer],
=======
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-home',
  imports: [HomeHeader,ProductCard,Footer,MatFormFieldModule,MatSelectModule],
>>>>>>> e65150a (Maquetación e implementación del componente home-header, footer y product-card)
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  obtenerProducto(valorBusqueda: string) {
    console.log('Producto buscado en Home:', valorBusqueda);

  }

   productoTest: Producto = {
      id: 1,
      nombre: 'Cámara Logitech C920',
      descripcion: 'Cámara digital de alta resolución con múltiples funciones y conectividad Wi-Fi.',
      precio: 2500.00,
      imageUrl: 'https://i.blogs.es/b6b656/canon/650_1200.jpg',
      stock: 28,
      idCategoriaProducto: 5,
      nombreCategoriaProducto: 'Accesorios Electrónicos',
      status: 'Activo'
    }

}
