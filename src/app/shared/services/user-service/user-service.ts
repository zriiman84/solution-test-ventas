import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiChangePasswordRequest, ApiLoginResponse, ApiRegisterUserRequest, ApiRegisterUserResponse, ApiResetPasswordRequest } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BaseResponse } from '../../models/generic.model';
import { VentaService } from '../venta-service/venta-service';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private UrlBase: string = environment.baseUrl;
  private http = inject(HttpClient);

  //Definiendo variables
  private tokenExpiration = new Date();

  private role: string = '';
  private email = '';
  private name = '';
  private userName = '';
  private isLoggedIn = false;
  private router = inject(Router);

  getRole() {
    return this.role;
  }

  getEmail() {
    return this.email;
  }

  getName() {
    return this.name;
  }

  getUserName(){
    return this.userName;
  }

  getTokenExpiration() {
    return this.tokenExpiration;
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  Login(usuario: string, password: string) {
    return this.http.post<ApiLoginResponse>(this.UrlBase + 'Users/Login', {
      UserName: usuario,
      Password: password,
    });
  }

  decodeToken() {

    //Obtener valores del Local Storage
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('expirationdatetime');

    //Si el token no existe (null) o el tokenExpiration no existe (null)
    if (!token || !tokenExpiration) return;

    //Setear el Expiration Date (Typescript lo convierte a formato local GMT-5 | UTC-5)
    this.tokenExpiration = new Date(tokenExpiration);

    //Al indicar <any> le digo a jwtDecode que traeré un objeto
    const tokenDecoded = jwtDecode<any>(token);

    //Obtener los valores de los CLAIMS provenientes del TOKEN
    this.role = tokenDecoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    this.email = tokenDecoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    this.name = tokenDecoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
    this.userName = tokenDecoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

    this.isLoggedIn = true; //el usuario está logueado
  }

  logout(flagExpirationToken : boolean){

    //Limpiamos el contenido del LOCAL STORAGE
    //localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('expirationdatetime');


    //Reseteo todas mis variables del servicio
    this.role = '';
    this.email = '';
    this.name = '';
    this.userName = ''
    this.tokenExpiration = new Date();
    this.isLoggedIn = false;

    //Valido si el parámetro flagExpirationToken es TRUE / FALSE, para redirigir al /Login o al Home /.
    if (flagExpirationToken) {
      alert('El Token ha expirado. Debe volver a iniciar sesión.');
      this.router.navigateByUrl('/login');
    } else {
      alert('Usted ha finalizado sesión exitosamente.');
      this.router.navigateByUrl('/');
    }

  }

  registerUser(userData : ApiRegisterUserRequest){
    return this.http.post<ApiRegisterUserResponse>(this.UrlBase + 'Users/RegistrarUsuario', userData);
  }

  requestTokenToResetPassword(paramEmail : string){
    return this.http.post<BaseResponse>(this.UrlBase + 'Users/RequestTokenToResetPassword',
      {
        email : paramEmail
      });
  }

  ResetPassword(resetPasswordData : ApiResetPasswordRequest){
    return this.http.post<BaseResponse>(this.UrlBase + 'Users/ResetPassword', resetPasswordData);
  }

  changePassword(changePasswordData : ApiChangePasswordRequest){
    return this.http.post<BaseResponse>(this.UrlBase + 'Users/ChangePassword', changePasswordData);
  }


}
