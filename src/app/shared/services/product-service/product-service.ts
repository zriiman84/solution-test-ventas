import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiProductoByIdResponse, ApiProductoByNombreResponse } from '../../models/producto.model';


@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private UrlBase : string =  'http://localhost:7060/api/';
  private http = inject(HttpClient);

  getProductById(id : string){
    return this.http.get<ApiProductoByIdResponse>(this.UrlBase + 'productos/' + id);
  }

  getProductByNombre(nombre : string){

    //Método no seguro por inyección de código (No usar)
    //return this.http.get<ApiProductoResponseByNombre>(this.UrlBase + 'productos?nombre='+ nombre + '&Page=1&PageSize=10');

    //Método seguro usando HttpParams
    let paramList = new HttpParams();

    paramList = paramList.append('nombre', nombre);
    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '10');

    return this.http.get<ApiProductoByNombreResponse>(this.UrlBase + 'productos', { params: paramList });
}

}
