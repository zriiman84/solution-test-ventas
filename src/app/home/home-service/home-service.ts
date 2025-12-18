import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiHomeResponse } from '../../shared/models/api-home.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', //Le asigna categoría de público y Singleton
})
export class HomeService {

  private UrlBase : string =  'https://localhost:5128/api/';
  private http = inject(HttpClient);

  getHomeData(): Observable<ApiHomeResponse> {
    return this.http.get<ApiHomeResponse>(this.UrlBase + 'Home'); //retorno un observable con un ApiHomeResponse para obtener la lista de categorías y productos
  }

}
