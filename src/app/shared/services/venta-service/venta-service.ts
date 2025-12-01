import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiVentaByFiltersResponse,
  ApiVentaByIdResponse,
  ApiVentaRequest,
  ApiVentaResponse,
  DetalleVentaRequest,
} from '../../models/venta.model';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private UrlBase: string = 'http://localhost:7060/api/';
  private http = inject(HttpClient);

  //No se usuará el id Empleado (el endpoint admite null) por tratarse de una compra online
  private requestVenta: ApiVentaRequest = {
    EmpleadoId: null,
    DetalleVenta: [],
  };

  //Agregar en memoria el item de venta
  addItemVenta(itemVenta: DetalleVentaRequest) {

    let listaProductosId: string = '';
    let listaCantidadProductos: string = '';

    // Agregar elementos distintos
    if (!this.requestVenta.DetalleVenta.some((c) => c.ProductoId === itemVenta.ProductoId)) {

      //Setear al Local Storage
      if (localStorage.getItem('ListaProductosId')) {
          listaProductosId =
            localStorage.getItem('ListaProductosId') + '|' + itemVenta.ProductoId.toString();
        } else {
          listaProductosId = itemVenta.ProductoId.toString();
        }

        if (localStorage.getItem('ListaCantidadProductos')) {
          listaCantidadProductos =
            localStorage.getItem('ListaCantidadProductos') + '|' + itemVenta.Cantidad.toString();
        } else {
          listaCantidadProductos = itemVenta.Cantidad.toString();
        }

        localStorage.setItem('ListaProductosId', listaProductosId);
        localStorage.setItem('ListaCantidadProductos', listaCantidadProductos);

    }else{

      //En caso de existir mismo producto con otra cantidad - actualizo la cantidad
      alert('El producto ya fue agregado al carrito, se reemplazará la cantidad');

      const index = this.requestVenta.DetalleVenta.findIndex((p) => p.ProductoId === itemVenta.ProductoId);
      this.requestVenta.DetalleVenta[index].Cantidad = itemVenta.Cantidad;  //actualizo la nueva cantidad

      localStorage.setItem('ListaProductosId', this.requestVenta.DetalleVenta.map(p => p.ProductoId).join("|"));
      localStorage.setItem('ListaCantidadProductos', this.requestVenta.DetalleVenta.map(p => p.Cantidad).join("|"));

      }

      this.getLocalStorage();
  }

  getVentaRequest() {
    return this.requestVenta;
  }

  getItemsVenta() {
    return this.requestVenta.DetalleVenta;
  }

  getLocalStorage() {

    let listaProductosId: string | null = '';
    let listaCantidadProducto: string | null = '';
    let arregloListaProductosId: string[] = [];
    let arregloCantidadProductos: string[] = [];
    let itemVenta: DetalleVentaRequest;
    this.requestVenta.DetalleVenta = [];

    listaProductosId = localStorage.getItem('ListaProductosId');
    listaCantidadProducto = localStorage.getItem('ListaCantidadProductos');

    if (!listaProductosId || !listaCantidadProducto) {
      return;
    }

    arregloListaProductosId = listaProductosId ? listaProductosId.split('|') : [];
    arregloCantidadProductos = listaCantidadProducto ? listaCantidadProducto.split('|') : [];

    if (
      arregloListaProductosId.length === 0 ||
      arregloListaProductosId.length === 0 ||
      arregloListaProductosId.length !== arregloCantidadProductos.length
    )
      return;

    //Volcar la información de los item de venta en el arreglo de DetalleVenta
    arregloListaProductosId.forEach((idprod, index) => {
      itemVenta = {
        ProductoId: parseInt(idprod),
        Cantidad: parseInt(arregloCantidadProductos[index]),
      };
      this.requestVenta.DetalleVenta.push(itemVenta);
    });
  }

  buyProducts(ventaRequest: ApiVentaRequest) {
    return this.http.post<ApiVentaResponse>(this.UrlBase + 'ventas', ventaRequest);
  }

  getSaleById(id: string) {
    return this.http.get<ApiVentaByIdResponse>(this.UrlBase + 'ventas/' + id);
  }

  getSalesByDate(dateStart: string, dateEnd: string) {
    //Método seguro usando HttpParams
    let paramList = new HttpParams();

    paramList = paramList.append('FechaInicio', dateStart);
    paramList = paramList.append('FechaFin', dateEnd);
    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '10');

    //return this.http.get<ApiVentaByFiltersResponse>(this.UrlBase + 'ventas/ListarVentasPorFecha?FechaInicio='+ dateStart + '&FechaFin=' + dateEnd + '&Page=1&PageSize=10');
    return this.http.get<ApiVentaByFiltersResponse>(this.UrlBase + 'ventas/ListarVentasPorFecha', {
      params: paramList,
    });
  }

  getSalesByClientAndEmployee(email: string, firstname: string, lastname: string) {
    //Método seguro usando HttpParams
    let paramList = new HttpParams();

    paramList = paramList.append('email', email);
    paramList = paramList.append('nombresEmpleado', firstname);
    paramList = paramList.append('apellidosEmpleado', lastname);
    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '10');

    return this.http.get<ApiVentaByFiltersResponse>(
      this.UrlBase + 'ventas/ListarVentasPorClienteYEmpleado',
      { params: paramList }
    );
  }

  getMyPurchases() {
    //Método seguro usando HttpParams
    let paramList = new HttpParams();

    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '10');

    return this.http.get<ApiVentaByFiltersResponse>(this.UrlBase + 'ventas/ListarMisCompras', {
      params: paramList,
    });
  }
}
