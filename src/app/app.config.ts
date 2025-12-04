import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { handleHttpErrorInterceptor, jwtHeaderInterceptor, tokenExpiredInterceptor } from './shared/interceptors/validaciones-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(  //matriculamos el proveedor de HttpClient
      withInterceptors([tokenExpiredInterceptor, handleHttpErrorInterceptor, jwtHeaderInterceptor]))   //matriculamos los interceptores
  ]
};
