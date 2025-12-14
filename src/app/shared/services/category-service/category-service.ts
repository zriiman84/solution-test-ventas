import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiCategoriaByFilterResponse,
  ApiCategoriaByIdResponse,
  ApiCategoriaProductoRequest,
  ApiCategoriaResponse,
} from '../../models/categoria.model';
import { BaseResponse } from '../../models/generic.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private UrlBase: string = 'http://localhost:5065/api/';
  private http = inject(HttpClient);

  getCategoryById(id: string) {
    return this.http.get<ApiCategoriaByIdResponse>(this.UrlBase + 'categorias/' + id);
  }

  getCategory(nombre: string | null) {
    //return this.http.get<ApiCategoriaByFilterResponse>(this.UrlBase + 'categorias/GetByNombre?nombre='+ nombre);

    //Método seguro usando HttpParams
    let paramList = new HttpParams();
    paramList = paramList.append('nombre', nombre ?? '');

    return this.http.get<ApiCategoriaByFilterResponse>(this.UrlBase + 'categorias/GetByNombre', {
      params: paramList,
    });
  }

  addCategory(categoryRequest: ApiCategoriaProductoRequest) {
    return this.http.post<ApiCategoriaResponse>(this.UrlBase + 'categorias', categoryRequest);
  }

  updateCategory(id: string, categoryRequest: ApiCategoriaProductoRequest) {
    return this.http.put<ApiCategoriaResponse>(this.UrlBase + 'categorias/' + id, categoryRequest);
  }

  deleteCategory(id: string) {
    return this.http.delete<BaseResponse>(this.UrlBase + 'categorias/' + id);
  }
}
