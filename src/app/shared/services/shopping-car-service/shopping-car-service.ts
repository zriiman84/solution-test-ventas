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

    if(!this.carrito.some(p => p.productoId === item.productoId)){
      this.carrito.push(item);
    }else{
      index = this.carrito.findIndex(p => p.productoId === item.productoId);
      this.carrito[index].cantidad = item.cantidad;
    }

    this.save();
  }

  removeItem(id: number) {
    this.carrito = this.carrito.filter(x => x.productoId !== id);
    this.save();
  }

  save() {
    const user = this.userService.getUserName();
    const KEY_LS = "car_" + user;
    localStorage.setItem(KEY_LS, JSON.stringify(this.carrito)); //almaceno el carrito de compras
  }

  getCartFromStorage() {
    const user = this.userService.getUserName();
    const KEY_LS = "car_" + user;
    const data = localStorage.getItem(KEY_LS);
    return data ? JSON.parse(data) : []; //obtengo el carrito de compras
  }

  getCar() {
    return this.carrito;
  }

  resetCar(){
    this.carrito.length = 0;
    const user = this.userService.getUserName();
    const KEY_LS = "car_" + user;
    const data = localStorage.removeItem(KEY_LS);
  }

}
