import { Component, inject } from '@angular/core';
import { LoggedInHeader } from '../shared/components/logged-in-header/logged-in-header';
import { Footer } from '../shared/components/footer/footer';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductCard } from '../shared/components/product-card/product-card';
import { ApiProductoByIdResponse, Producto } from '../shared/models/producto.model';
import { UserService } from '../shared/services/user-service/user-service';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../shared/services/product-service/product-service';
import { AddProductBuyDialog } from '../shared/components/add-product-buy-dialog/add-product-buy-dialog';


@Component({
  selector: 'app-product-detail',
  imports: [LoggedInHeader, ProductCard, Footer],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {

  producto: Producto | null = null;
  private userService = inject(UserService);
  private activatedRoute = inject(ActivatedRoute); //Inyectamos la clase ActivatedRoute para poder interactuar con la URL Actual
  private productService = inject(ProductService);
  private matDialog = inject(MatDialog);
  private router = inject(Router);
  private eventId: string = '0'; //Almacena el Id del evento obtenido de la URL

  ngOnInit() {

    this.eventId = this.activatedRoute.snapshot.paramMap.get('id') ?? '0'; // Obtengo el id de la ruta

    //Obtengo el producto desde el servicio
    this.productService.getProductById(this.eventId).subscribe((res: ApiProductoByIdResponse) => {
      this.producto = res.Data;
    });
  }

  openBuyDialog() {

    //Si no está logueado se mostrará una alerta y se redireccionará al login
    if (!this.userService.getIsLoggedIn()) {
      alert('Debes iniciar sesión para comprar');
      this.router.navigateByUrl('/login');
      return;
    }

    //Si el rol es Administrator se mostrará una alerta indicando que este rol no puede comprar productos.
    if (this.userService.getRole() === 'Administrator') {
      alert('Los administradores no pueden comprar productos');
      this.router.navigateByUrl('/');
      return;
    }

    const productBuyDialog = this.matDialog.open(AddProductBuyDialog, {
      data: this.producto
    });

    productBuyDialog.afterClosed().subscribe(() => {
        this.router.navigateByUrl('/');
    });

  }
}
