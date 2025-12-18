import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appResaltarProductCard]'
})
export class ResaltarProductCard {

  constructor() { }

  elementRef = inject(ElementRef);

	  @HostListener('mouseenter') pasarMouse() {
	    this.elementRef.nativeElement.style.transform = 'scale(1.05)';	//Permite agrandar al 50% el contenido
	    this.elementRef.nativeElement.style.boxShadow = 'var(--primary-color) 0 0 10px'; //Permite asignarle sombra al contenido
	    this.elementRef.nativeElement.style.transition = 'transform 300ms, box-shadow 300ms'; //Permite darle rapidez o lentitud al transform y shadow
	  }
	  @HostListener('mouseleave') alejarMouse() {
	    this.elementRef.nativeElement.style.transform = 'scale(1)';	//Resetea el contenido a su forma original
	    this.elementRef.nativeElement.style.boxShadow = 'none';	//Resetea el contenido sin sombra
	  }

}
