import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductoResponseById, ProductoResponseByNombre } from '../../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private UrlBase : string =  'http://localhost:7060/api/';
  private http = inject(HttpClient);

  getProductById(id : number){
    return this.http.get<ProductoResponseById>(this.UrlBase + 'productos/' + id.toString());
  }

  getProductByNombre(nombre : string){

    //Método no seguro por inyección de código (No usar)
    //return this.http.get<ProductoResponseByNombre>(this.UrlBase + 'productos?nombre='+ nombre + '&Page=1&PageSize=10');

    //Método seguro usando HttpParams
    let paramList = new HttpParams();

    paramList = paramList.append('nombre', nombre);
    paramList = paramList.append('Page', '1');
    paramList = paramList.append('PageSize', '10');

    return this.http.get<ProductoResponseByNombre>(this.UrlBase + 'productos', { params: paramList });
}

}
