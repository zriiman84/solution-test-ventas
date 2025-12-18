import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoggedInHeader } from '../shared/components/logged-in-header/logged-in-header';
import { Footer } from '../shared/components/footer/footer';
import { UserService } from '../shared/services/user-service/user-service';

@Component({
  selector: 'app-customer',
  imports: [LoggedInHeader, Footer,RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(){

     //Si no está logueado se mostrará una alerta y se redireccionará al login
    if (!this.userService.getIsLoggedIn()) {
      alert('Debes iniciar sesión');
      this.router.navigateByUrl('/login');
    }

    //Si no tiene rol de Customer se mostrará una alerta
    if (this.userService.getRole() !== 'Customer') {
      alert('Únicamente los clientes pueden ingresar a esta opción.');
      this.router.navigateByUrl('/');
    }

  }

}

