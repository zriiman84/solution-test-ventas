import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-header',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './home-header.html',
  styleUrl: './home-header.css',
})
export class HomeHeader {
  @Output() searchProductValueChange = new EventEmitter<string>();

  buscarProducto(eventvalue: Event) {
    const inputEvent = eventvalue as InputEvent;
    const target = inputEvent.target as HTMLInputElement;
    const value = target.value;

    console.log('Home-header product:', value);
    this.searchProductValueChange.emit(value); //se enviará el valor al componente padre
  }
}
