import { Component, inject, OnInit } from '@angular/core';
import { LoggedInHeader } from '../shared/components/logged-in-header/logged-in-header';
import { Footer } from '../shared/components/footer/footer';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../shared/services/user-service/user-service';

@Component({
  selector: 'app-admin',
  imports: [LoggedInHeader, Footer, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit  {

  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(){

     //Si no está logueado se mostrará una alerta y se redireccionará al login
    if (!this.userService.getIsLoggedIn()) {
      alert('Debes iniciar sesión');
      this.router.navigateByUrl('/login');
      return;
    }

    //Si el rol no es Administrator se mostrará una alerta
    if (this.userService.getRole() !== 'Administrator') {
      alert('Únicamente los administradores pueden ingresar a esta opción.');
      this.router.navigateByUrl('/');
      return;
    }

  }

}
