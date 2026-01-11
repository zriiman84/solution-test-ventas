import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiHomeResponse } from '../../shared/models/api-home.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root', //Le asigna categoría de público y Singleton
})
export class HomeService {

  private UrlBase : string =  environment.baseUrl;
  private http = inject(HttpClient);

  getHomeData(): Observable<ApiHomeResponse> {
    return this.http.get<ApiHomeResponse>(this.UrlBase + 'Home'); //retorno un observable con un ApiHomeResponse para obtener la lista de categorías y productos
  }

}
