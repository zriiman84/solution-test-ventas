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

      console.log('[Http Error]: ' + error.status + ' -  [Mensaje Error]: ' + (error.error.errorMessage ?? error.message));

      //Switch para manejar códigos de error
      switch(error.status){
        case 400:
          alert('Error [400]: Solicitud incorrecta. Verifica los datos enviados.');
          break;

        case 401:
          alert('Error [401]: No está autenticado. Debe iniciar sesión');
          break;

        case 403:
          alert('Error [403]: No tiene suficientes permisos para realizar esta acción.');
          break;

        case 404:
          alert('Error [404]: El recurso solicitado no existe. Comuníquese con el administrador.');
          break;

        case 500:
          alert('Error [500]: Error interno del servidor, comuníquese con el administrador del sistema. [Mensaje Error]: ' +  (error.error.errorMessage ?? error.message));
          break;

          default:
          alert('Error [' + error.status + ']: Ocurrió un error inesperado, comuníquese con el administrador del sistema. [Mensaje Error]: ' +  (error.error.errorMessage ?? error.message));
          break;
      }

      return EMPTY; //Corta el flujo sin lanzar excepción al componente.
    })
  );
};
