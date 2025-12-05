import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './shared/services/user-service/user-service';
import { VentaService } from './shared/services/venta-service/venta-service';
import { ShoppingCarService } from './shared/services/shopping-car-service/shopping-car-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('solution-test-ventas');
  private userService: UserService | null;
  private carService: ShoppingCarService | null;

  constructor(){

    //Creo la instancia de UserService que será singleton.
    this.userService = inject(UserService);

    //Decodificar el token para setear los valores de los claims
    //Persistencia de sesión
    this.userService.decodeToken();

    //Obtener desde Local Storage los productos agregados en memoria
    this.carService = inject(ShoppingCarService);
    this.carService.loadCar();

  }
}
