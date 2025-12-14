import { Component, inject } from '@angular/core';
import { SimpleHeader } from '../shared/components/simple-header/simple-header';
import { Footer } from '../shared/components/footer/footer';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../shared/services/user-service/user-service';
import { ApiLoginResponse } from '../shared/models/usuario.model';
import { ShoppingCarService } from '../shared/services/shopping-car-service/shopping-car-service';

@Component({
  selector: 'app-login',
  imports: [
    SimpleHeader,
    Footer,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  //REGEX para ingresar al menos un dígito numérico del 0 al 9
  readonly regexDigito = /.*[0-9].*/;
  //REGEX para validar un email
  readonly regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //REGEX para ingresar un nombre de usuario (Permite letras, números, punto, guion y subguion)
  readonly regexUser = /^[a-zA-Z0-9._-]+$/;

  userService = inject(UserService);
  carService = inject(ShoppingCarService);
  router = inject(Router);

  // Validador inline dentro de la clase
  //Validaremos 2 regex al mismo tiempo: email o username
  emailOrUserValidator = (control: AbstractControl) => {
    const value = control.value as string;

    if (!value) return { required: true };

    if (this.regexEmail.test(value) || this.regexUser.test(value)) {
      return null; // válido
    }

    return { emailOrUser: true };
  };

  loginForm: FormGroup = new FormGroup({
    usuario_email: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(100),
      this.emailOrUserValidator,  //validar que sea email o username
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.regexDigito),
    ]),
  });

  login() {

    const usuario_email = this.loginForm.controls['usuario_email'].value!;
    const password = this.loginForm.controls['password'].value!;

    this.userService.Login(usuario_email, password).subscribe((resp: ApiLoginResponse) => {
      //Obtenemos el token y expirationdate desde el response del Api
      const token = resp.Data.Token;
      const expirationdatetime = resp.Data.ExpirationDateTime; //Formato UTC

      //Seteamos el token y expirationdate en el Local Storage
      localStorage.setItem('token', token);
      localStorage.setItem('expirationdatetime', expirationdatetime);

      //Decodificar el token para setear los valores de los claims
      this.userService.decodeToken();

      alert('Usuario: "' + this.userService.getName() + '" ha iniciado sesión.');

        //Obtener desde Local Storage los productos agregados en memoria
      this.carService.loadCar();

      //Navegamos al HOME por defecto
      this.router.navigateByUrl('/');
    });
  }

}
