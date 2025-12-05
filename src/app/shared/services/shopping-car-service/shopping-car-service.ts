import { inject, Injectable } from '@angular/core';
import { DetalleVentaRequest } from '../../models/venta.model';
import { UserService } from '../user-service/user-service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCarService {

  private carrito: DetalleVentaRequest[] = [];
  private userService = inject(UserService);

   loadCar() {
    this.carrito = this.getCartFromStorage();
  }

  addItem(item: DetalleVentaRequest) {

    let index: number = 0;

    if(!this.carrito.some(p => p.ProductoId === item.ProductoId)){
      this.carrito.push(item);
    }else{
      index = this.carrito.findIndex(p => p.ProductoId === item.ProductoId);
      this.carrito[index].Cantidad = item.Cantidad;
    }

    this.save();
  }

  removeItem(id: number) {
    this.carrito = this.carrito.filter(x => x.ProductoId !== id);
    this.save();
  }

  save() {
    const user = this.userService.getEmail().split('@')[0];
    const KEY_LS = "car_" + user;
    localStorage.setItem(KEY_LS, JSON.stringify(this.carrito));
  }

  getCartFromStorage() {
    const user = this.userService.getEmail().split('@')[0];
    const KEY_LS = "car_" + user;
    const data = localStorage.getItem(KEY_LS);
    return data ? JSON.parse(data) : []; //obtengo el carrito de compras
  }

  getCar() {
    return this.carrito;
  }

  resetCar(){
    this.carrito.length = 0;
    const user = this.userService.getEmail().split('@')[0];
    const KEY_LS = "car_" + user;
    localStorage.removeItem(KEY_LS);
  }

}
