import { Component, inject, OnInit } from '@angular/core';
import {
  ApiVentaRequest,
  ApiVentaResponse,
  DetalleVentaRequest,
  ShoppingCarItem,
} from '../shared/models/venta.model';
import { VentaService } from '../shared/services/venta-service/venta-service';
import { ProductService } from '../shared/services/product-service/product-service';
import { MatTableModule } from '@angular/material/table';
import { LoggedInHeader } from '../shared/components/logged-in-header/logged-in-header';
import { Footer } from '../shared/components/footer/footer';
import { UserService } from '../shared/services/user-service/user-service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddProductBuyDialog } from '../shared/components/add-product-buy-dialog/add-product-buy-dialog';
import { VoucherDialog } from '../shared/components/voucher-dialog/voucher-dialog';
import confetti from 'canvas-confetti';
import { ShoppingCarService } from '../shared/services/shopping-car-service/shopping-car-service';
import { ApiProductoByFilterResponse, Producto } from '../shared/models/producto.model';

@Component({
  selector: 'app-shopping-car',
  imports: [MatTableModule, LoggedInHeader, Footer, MatButtonModule],
  templateUrl: './shopping-car.html',
  styleUrl: './shopping-car.css',
})
export class ShoppingCar implements OnInit {

  //Inyecciones
  private ventaService = inject(VentaService);
  private productoService = inject(ProductService);
  private carroService = inject(ShoppingCarService);
  usuarioService = inject(UserService);
  private router = inject(Router);

  //Variables
  private listaDetalleVenta: DetalleVentaRequest[] = [];
  private producto: Producto | null = null;
  private listaProductos: Producto[] = [];
  listaShoppingCar: ShoppingCarItem[] = [];
  listaShoppingCarTmp : ShoppingCarItem[] = [];
  montoTotal: number = 0;
  flagHabilitarCompra: boolean = false;

  //Header del mat-table
  displayedColumns: string[] = [
    'nombreProducto',
    'precioUnitario',
    'cantidad',
    'subTotal',
    'categoriaProducto',
    'Acciones',
  ];

  private matDialog = inject(MatDialog);

  ngOnInit() {
    this.flagHabilitarCompra = false;

    //Validar usuario logueado
    if (!this.usuarioService.getIsLoggedIn()) {
      alert('Usted no ha iniciado sesión. Debe loguearse y añadir productos a su carrito');
      this.router.navigateByUrl('/');
      return;
    }

    //Si el rol  es Administrator se mostrará una alerta
    if (this.usuarioService.getRole() === 'Administrator') {
      alert('Los administradores no pueden comprar productos.');
      this.router.navigateByUrl('/');
      return;
    }

    this.listaDetalleVenta = this.carroService.getCar();

    if (this.listaDetalleVenta.length <= 0) {
      alert('Usted aún no tiene productos en su carrito');
      this.router.navigateByUrl('/');
      return;
    }

    this.loadData(this.listaDetalleVenta);
  
  }

  loadData(listaDetalleVenta : DetalleVentaRequest[]) : void {
    
    this.listaShoppingCarTmp = [];

    this.ventaService.GetListProductsByIds(listaDetalleVenta).subscribe((resp: ApiProductoByFilterResponse) => {

      //1. Obtener los productos
      if(resp.data){
          this.listaProductos = resp.data;
      
          //2. Agregar índice, Cantidad y SubTotal
          for (const producto of this.listaProductos) {
            const item = this.listaDetalleVenta.find((p) => p.productoId === producto.id);
            let itemVenta: ShoppingCarItem;

            if (item) {
              itemVenta = {
                id: producto.id,
                nombreProducto: producto.nombre,
                precioUnitario: producto.precioUnitario,
                cantidad: item.cantidad,
                subTotal: producto.precioUnitario * item.cantidad,
                categoriaProducto: producto.nombreCategoriaProducto,
              };
              this.listaShoppingCarTmp.push(itemVenta);
            }
          }

          //Ordenar por precio en forma ascendente
          //this.listaProductos.sort((a, b) => a.Nombre.localeCompare(b.Nombre));

          //3. Ordenar el arreglo por precio de forma ascendente
          this.listaShoppingCarTmp.sort((a, b) => a.precioUnitario - b.precioUnitario);
          this.montoTotal = this.listaShoppingCarTmp.reduce((acc, p) => acc + p.subTotal, 0);
          this.listaShoppingCar = this.listaShoppingCarTmp;
          this.listaShoppingCarTmp = [];

          if(this.listaShoppingCar && this.listaShoppingCar.length > 0){
            this.flagHabilitarCompra = true;
          }
      }
    });
  }

  eliminar(id: number) {
    this.listaShoppingCar = this.listaShoppingCar.filter((p) => p.id !== id);
    //Recalculo al monto total
    this.montoTotal = this.listaShoppingCar.reduce((acc, p) => acc + p.subTotal, 0);

    this.carroService.removeItem(id);
  }

  editar(id: number) {
    const itemProducto: Producto | null = this.listaProductos.find((p) => p.id === id) ?? null;

    if (!itemProducto) return;

    const modal = this.matDialog.open(AddProductBuyDialog, {
      data: itemProducto,
    });

    modal.afterClosed().subscribe(() => {
      this.listaDetalleVenta = this.carroService.getCar();

      this.listaShoppingCar = this.listaShoppingCar.map((itemShopping) => {
        const item = this.listaDetalleVenta.find((p) => p.productoId === itemShopping.id);
        if (!item) return itemShopping;
        return {
          id: itemShopping.id,
          nombreProducto: itemShopping.nombreProducto,
          precioUnitario: itemShopping.precioUnitario,
          cantidad: item.cantidad,
          subTotal: itemShopping.precioUnitario * item.cantidad,
          categoriaProducto: itemShopping.categoriaProducto,
        };
      });

      //Recalculo al monto total
      this.montoTotal = this.listaShoppingCar.reduce((acc, p) => acc + p.subTotal, 0);
    });
  }

  executeBuy() {
    let ventaId: number = 0;

    const requestVenta: ApiVentaRequest = {
      empleadoId: 0,
      detalleVenta: this.carroService.getCar(),
    };

    console.log('DetalleVenta: ' + JSON.stringify(requestVenta, null, 2));

    //Invoco al endpoint de la venta
    this.ventaService.buyProducts(requestVenta).subscribe((resp: ApiVentaResponse) => {

      ventaId = resp.data ?? 0;
      if(!ventaId) return;

      alert('Se realizó la compra exitosamente');

      //Código para el efecto confetti
      confetti({
        zIndex: 1002, //ingreso un valor mayor para que el confetti esté por encima de todo.
      });

      this.resetShoppingCar();

      //Invocar al voucher-dialog
      const voucherDialog = this.matDialog.open(VoucherDialog, {
        data: ventaId,
        disableClose: true,
      });

      voucherDialog.afterClosed().subscribe(() => {
        this.router.navigateByUrl('/');
      });
    });
  }

  returnToHome() {
    this.router.navigateByUrl('/');
  }

  resetShoppingCar(){
    this.carroService.resetCar();
    this.listaShoppingCar = [];
    this.listaShoppingCarTmp = [];
    this.flagHabilitarCompra = false;

  }
}
