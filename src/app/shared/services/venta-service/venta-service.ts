import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiVentaByFiltersResponse,
  ApiVentaByIdResponse,
  ApiVentaReporteClienteResponse,
  ApiVentaReporteProductoResponse,
  ApiVentaRequest,
  ApiVentaResponse,
} from '../../models/venta.model';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private UrlBase: string = 'http://localhost:5128/api/';
  private http = inject(HttpClient);



  buyProducts(ventaRequest: ApiVentaRequest) {
    return this.http.post<ApiVentaResponse>(this.UrlBase + 'Ventas', ventaRequest);
  }

  getSaleById(id: string) {
    return this.http.get<ApiVentaByIdResponse>(this.UrlBase + 'Ventas/' + id);
  }

  getSalesByDate(dateStart: string, dateEnd: string) {
    //Método seguro usando HttpParams
    let paramList = new HttpParams();

    paramList = paramList.append('FechaInicio', dateStart);
    paramList = paramList.append('FechaFin', dateEnd);
    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '100');

    //return this.http.get<ApiVentaByFiltersResponse>(this.UrlBase + 'ventas/ListarVentasPorFecha?FechaInicio='+ dateStart + '&FechaFin=' + dateEnd + '&Page=1&PageSize=10');
    return this.http.get<ApiVentaByFiltersResponse>(this.UrlBase + 'Ventas/ListarVentasPorFecha', {
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
    paramList = paramList.append('PageSize', '100');

    return this.http.get<ApiVentaByFiltersResponse>(
      this.UrlBase + 'Ventas/ListarVentasPorClienteYEmpleado',
      { params: paramList }
    );
  }

  getMyPurchases() {
    //Método seguro usando HttpParams
    let paramList = new HttpParams();

    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '100');

    return this.http.get<ApiVentaByFiltersResponse>(this.UrlBase + 'Ventas/ListarMisCompras', {
      params: paramList,
    });
  }

  getSales(flagPagination: boolean) {

    let paramList = new HttpParams();

    paramList = paramList.append('flagPagination', flagPagination);
    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '100');

    return this.http.get<ApiVentaByFiltersResponse>(
      this.UrlBase + 'Ventas/ListarVentas',
      { params: paramList }
    );
  }

  GetSaleReportByClient(dateStart: string, dateEnd: string) {

    let paramList = new HttpParams();

    paramList = paramList.append('fechaInicio', dateStart);
    paramList = paramList.append('fechaFin', dateEnd);

    return this.http.get<ApiVentaReporteClienteResponse>(
      this.UrlBase + 'Reports/VentasCliente',
      { params: paramList }
    );
  }

  GetSaleReportByProduct(dateStart: string, dateEnd: string) {

    let paramList = new HttpParams();

    paramList = paramList.append('fechaInicio', dateStart);
    paramList = paramList.append('fechaFin', dateEnd);

    return this.http.get<ApiVentaReporteProductoResponse>(
      this.UrlBase + 'Reports/VentasProducto',
      { params: paramList }
    );
  }
}
