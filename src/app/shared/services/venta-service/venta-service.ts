import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiVentaByFiltersResponse,
  ApiVentaByIdResponse,
  ApiVentaRequest,
  ApiVentaResponse,
} from '../../models/venta.model';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private UrlBase: string = 'http://localhost:7060/api/';
  private http = inject(HttpClient);



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
    paramList = paramList.append('PageSize', '100');

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
    paramList = paramList.append('PageSize', '100');

    return this.http.get<ApiVentaByFiltersResponse>(
      this.UrlBase + 'ventas/ListarVentasPorClienteYEmpleado',
      { params: paramList }
    );
  }

  getMyPurchases() {
    //Método seguro usando HttpParams
    let paramList = new HttpParams();

    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '100');

    return this.http.get<ApiVentaByFiltersResponse>(this.UrlBase + 'ventas/ListarMisCompras', {
      params: paramList,
    });
  }
}
