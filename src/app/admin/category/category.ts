import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user-service/user-service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category',
  imports: [RouterLink, RouterOutlet, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {

   private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit() {
    //Si no está logueado se mostrará una alerta y se redireccionará al login
    if (!this.userService.getIsLoggedIn()) {
      alert('Debes iniciar sesión');
      this.router.navigateByUrl('/login');
    }

    //Si el rol no es Administrator se mostrará una alerta
    if (this.userService.getRole() !== 'Administrator') {
      alert('Únicamente los administradores pueden registrar categorías de productos.');
      this.router.navigateByUrl('/');
    }

  }

}
