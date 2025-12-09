import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router,RouterLinkActive,RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user-service/user-service';

@Component({
  selector: 'app-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLinkActive
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit() {
    //Si no está logueado se mostrará una alerta y se redireccionará al login
    if (!this.userService.getIsLoggedIn()) {
      alert('Debes iniciar sesión');
      this.router.navigateByUrl('/login');
      return;
    }

    //Si el rol no es Administrator se mostrará una alerta
    if (this.userService.getRole() !== 'Administrator') {
      alert('Únicamente los administradores pueden registrar productos.');
      this.router.navigateByUrl('/');
      return;
    }

  }

}
