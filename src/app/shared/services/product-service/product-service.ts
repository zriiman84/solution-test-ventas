import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiProductoByFilterResponse,
  ApiProductoByIdResponse,
  ApiProductoResponse,
  Producto,
} from '../../models/producto.model';
import { BaseResponse } from '../../models/generic.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private UrlBase: string = 'https://localhost:5128/api/';
  private http = inject(HttpClient);

  getProductById(id: number) {
    return this.http.get<ApiProductoByIdResponse>(this.UrlBase + 'Productos/' + id);
  }

  getProductByName(nombre: string) {
    //Método no seguro por inyección de código (No usar)
    //return this.http.get<ApiProductoResponseByNombre>(this.UrlBase + 'productos?nombre='+ nombre + '&Page=1&PageSize=10');

    //Método seguro usando HttpParams
    let paramList = new HttpParams();
    paramList = paramList.append('nombre', nombre?.trim());
    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '100');

    return this.http.get<ApiProductoByFilterResponse>(this.UrlBase + 'Productos/GetByNombre', {
      params: paramList,
    });
  }

  //El backend recibe un objeto Producto pero con IFomrFile como atributo para la imagen
  //Para enviar un objeto Producto con este tipo de atributo se envía un FormData dessde el FrontEnd
  addProduct(requestProduct: FormData) {
    return this.http.post<ApiProductoResponse>(this.UrlBase + 'Productos', requestProduct);
  }

  updateProduct(id: string, requestProduct: FormData) {
    return this.http.put<ApiProductoResponse>(this.UrlBase + 'Productos/' + id, requestProduct);
  }

  deleteProduct(id: string) {
    return this.http.delete<BaseResponse>(this.UrlBase + 'Productos/' + id);
  }
}
