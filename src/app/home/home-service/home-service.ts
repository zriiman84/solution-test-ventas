import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiHomeResponse } from '../../shared/models/api-home.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', //Le asigna categoría de público y Singleton
})
export class HomeService {

  private UrlBase : string =  'http://localhost:7060/api/';
  private http = inject(HttpClient);

  getHomeData(): Observable<ApiHomeResponse> {
    return this.http.get<ApiHomeResponse>(this.UrlBase + 'Home'); //retorno un observable de tipo ApiHomeResponse para obtener la lista de categorías y productos
  }

}
