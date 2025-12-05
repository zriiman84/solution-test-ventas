import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import confetti from 'canvas-confetti';
import { Footer } from '../shared/components/footer/footer';
import { LoggedInHeader } from '../shared/components/logged-in-header/logged-in-header';
import { VentaService } from '../shared/services/venta-service/venta-service';
import { ProductService } from '../shared/services/product-service/product-service';
import { UserService } from '../shared/services/user-service/user-service';
import { ApiVentaRequest, ApiVentaResponse, DetalleVentaRequest, ShoppingCarItem } from '../shared/models/venta.model';
import { ApiProductoByIdResponse, Producto } from '../shared/models/producto.model';
import { VoucherDialog } from '../shared/components/voucher-dialog/voucher-dialog';
import { AddProductBuyDialog } from '../shared/components/add-product-buy-dialog/add-product-buy-dialog';


@Component({
  selector: 'app-shopping-car',
  imports: [MatTableModule,LoggedInHeader, Footer, MatButtonModule],
  templateUrl: './shopping-car.html',
  styleUrl: './shopping-car.css',
})
export class ShoppingCar {

  //Inyecciones
  private ventaService = inject(VentaService);
  private productoService = inject(ProductService);
  usuarioService = inject(UserService);
  private router = inject(Router);

  //Variables
  private listaDetalleVenta: DetalleVentaRequest[] = [];
  private producto: Producto | null = null;
  private listaProductos: Producto[] = [];
  listaShoppingCar: ShoppingCarItem[] = [];
  montoTotal: number = 0;

  //Header del mat-table
  displayedColumns: string[] = [
    'NombreProducto',
    'PrecioUnitario',
    'Cantidad',
    'SubTotal',
    'CategoriaProducto',
    'Acciones',
  ];

  private matDialog = inject(MatDialog);

  ngOnInit() {
    let itemVenta: ShoppingCarItem;

    //Validar usuario logueado
    if (!this.usuarioService.getIsLoggedIn()) {
      alert('Usted no ha iniciado sesión. Debe loguearse y añadir productos a su carrito');
      this.router.navigateByUrl('/');
      return;
    }

    this.listaDetalleVenta = this.ventaService.getItemsVenta();

    if (this.listaDetalleVenta.length <= 0) {
      alert('Usted aún no tiene productos en su carrito');
      this.router.navigateByUrl('/');
      return;
    }
    //1. Obtener los productos
    for(const item of this.listaDetalleVenta){
      //Obtener el producto por Id mediante servicio
      this.producto = this.getProductById(item.ProductoId.toString());
      if(!this.producto) return;
      this.listaProductos.push(this.producto);
    }

    //2. Agregar índice, Cantidad y SubTotal
    for (const producto of this.listaProductos) {
      const item = this.listaDetalleVenta.find((p) => p.ProductoId === producto.Id);

      if (item) {
        itemVenta = {
          Id: producto.Id,
          NombreProducto: producto.Nombre,
          PrecioUnitario: producto.PrecioUnitario,
          Cantidad: item.Cantidad,
          SubTotal: producto.PrecioUnitario * item.Cantidad,
          CategoriaProducto: producto.NombreCategoriaProducto,
        };
        this.listaShoppingCar.push(itemVenta);
      }
    }

    //Ordenar por precio en forma ascendente
    //this.listaProductos.sort((a, b) => a.Nombre.localeCompare(b.Nombre));

    //3. Ordenar el arreglo por precio de forma ascendente
    this.listaShoppingCar.sort((a, b) => a.PrecioUnitario - b.PrecioUnitario);

    //Calculo el monto total
    this.montoTotal = this.listaShoppingCar.reduce((acc, p) => acc + p.SubTotal, 0);
  }

  getProductById(id: string) {
    let itemProducto: Producto | null = null;

    this.productoService.getProductById(id).subscribe((resp: ApiProductoByIdResponse) => {
      itemProducto = resp.Data;
    });

    return itemProducto;
  }

  eliminar(id: number) {
    const index = this.listaShoppingCar.findIndex((p) => p.Id === id);
    //Elimino del arreglo el elemento con el índice index
    this.listaShoppingCar.splice(index, 1);

    this.listaShoppingCar = this.listaShoppingCar.filter((p) => p.Id !== id);
    //Recalculo al monto total
    this.montoTotal = this.listaShoppingCar.reduce((acc, p) => acc + p.SubTotal, 0);

    this.ventaService.deleteItem(id);
  }

  editar(id: number) {
    const itemProducto: Producto | null = this.listaProductos.find((p) => p.Id === id) ?? null;

    if (!itemProducto) return;

    const modal = this.matDialog.open(AddProductBuyDialog, {
      data: itemProducto,
    });

    modal.afterClosed().subscribe(() => {
      this.listaDetalleVenta = this.ventaService.getItemsVenta();

      this.listaShoppingCar = this.listaShoppingCar.map((itemShopping) => {
        const item = this.listaDetalleVenta.find((p) => p.ProductoId === itemShopping.Id);
        if (!item) return itemShopping;
        return {
          Id: itemShopping.Id,
          NombreProducto: itemShopping.NombreProducto,
          PrecioUnitario: itemShopping.PrecioUnitario,
          Cantidad: item.Cantidad,
          SubTotal: itemShopping.PrecioUnitario * item.Cantidad,
          CategoriaProducto: itemShopping.CategoriaProducto,
        };
      });

      //Recalculo al monto total
      this.montoTotal = this.listaShoppingCar.reduce((acc, p) => acc + p.SubTotal, 0);
    });
  }

  executeBuy() {

    let ventaId: number = 0;

    const requestVenta: ApiVentaRequest = {
      EmpleadoId: 0,  //No es necesario enviar EmpleadoId para ventas online (puede enviarse null o cero)
      DetalleVenta: this.ventaService.getItemsVenta(),
    };

    console.log('DetalleVenta: ' + JSON.stringify(requestVenta, null, 2));


    //Invoco al endpoint de la venta
    this.ventaService.buyProducts(requestVenta).subscribe((resp: ApiVentaResponse) => {

      ventaId = resp.Data ?? 0;

      if(!ventaId) return;

      alert('Se realizó la compra exitosamente');

       //Código para el efecto confetti
      confetti({
        zIndex: 1002, //ingreso un valor mayor para que el confetti esté por encima de todo.
      });

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
}
