import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { UserService } from '../services/user-service/user-service';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';

export const validacionesInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

// Función Interceptor para manejar la validación de la expiración del token
export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {

  const userService = inject(UserService);

  if(!userService.getIsLoggedIn()){
    return next(req);
  }

  const fechaHoraActual = new Date();

  if(fechaHoraActual > userService.getTokenExpiration()){
    userService.logout(true);
    return EMPTY;             //Corta el flujo sin lanzar excepción al componente. No se envía la petición HTTP al backend.
  }else{
    console.log('TOKEN aún no expira');
    return next(req);        //Pasar la petición al siguiente interceptor o al backend
  }

};

// Función Interceptor para manejar la validación de ERRORES DE HTTP
export const handleHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      let serverMessage = error.error?.message || null;

      if(serverMessage){
        serverMessage = error.error?.errorMessage ?? error?.message;
      }

      console.log('[Http Error]: ' + error.status + ' -  [Mensaje Error]: ' + (serverMessage ?? ''));

      //Switch para manejar códigos de error
      switch(error.status){
        case 400:
          alert('Error [400]: Solicitud incorrecta. Verifica los datos enviados. ' + (serverMessage ?? ''));
          break;

        case 401:
          alert('Error [401]: No está autenticado. Debe iniciar sesión. ' + (serverMessage ?? ''));
          break;

        case 403:
          alert('Error [403]: No tiene suficientes permisos para realizar esta acción. ' + (serverMessage ?? ''));
          break;

        case 404:
          alert('Error [404]: El recurso solicitado no existe. ' + (serverMessage ?? ''));
          break;

        case 500:
          alert('Error [500]: Error interno del servidor, comuníquese con el administrador del sistema. [Mensaje Error]: ' +  (serverMessage ?? ''));
          break;

          default:
          alert('Error [' + error.status + ']: Ocurrió un error inesperado, comuníquese con el administrador del sistema. [Mensaje Error]: ' +  (serverMessage ?? ''));
          break;
      }

      return EMPTY; //Corta el flujo sin lanzar excepción al componente.
    })
  );
};

//Interceptor para enviar el token en la header de la petición
export const jwtHeaderInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  if (token) {
    return next(
      // Clonamos la solicitud y agregamos el header Authorization
      req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      })
    );
  }

  //Si el TOKEN es nulo, retornamos el REQUEST tal cual como vino
  return next(req);
};
