import { Component, inject } from '@angular/core';
import { SimpleHeader } from '../shared/components/simple-header/simple-header';
import { Footer } from '../shared/components/footer/footer';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink} from "@angular/router";
import { UserService } from '../shared/services/user-service/user-service';
import { ApiLoginResponse } from '../shared/models/usuario-model';

@Component({
  selector: 'app-login',
  imports: [SimpleHeader, Footer, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private userService: UserService;
  private router : Router;

  readonly regexDigito = /.*[0-9].*/;   //Regular Expression para ingresar al menos un dígito numérico del 0 al 9

  loginForm: FormGroup = new FormGroup(
    {
      usuario: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(this.regexDigito)]),
    }
  )

  constructor(){
    this.userService = inject(UserService);
    this.router = inject(Router);
  }

  login(){
    const usuario = this.loginForm.controls["usuario"].value!;
    const password = this.loginForm.controls["password"].value!;

    //this.prueba();

    this.userService.Login(usuario, password).subscribe((resp : ApiLoginResponse) =>
      {
        //Obtenemos el token y expirationdate desde el response del Api
        const token = resp.data.token;
        const expirationdatetime = resp.data.expirationdatetime; //Formato UTC

        //Seteamos el token y expirationdate en el Local Storage
        localStorage.setItem('token', token);
        localStorage.setItem('expirationdatetime', expirationdatetime);

        //Decodificar el token para setear los valores de los claims
        this.userService.decodeToken();

        alert('Usuario: "' + this.userService.getName() + '" ha iniciado sesión.');

        //Navegamos al HOME por defecto
        this.router.navigateByUrl('/');

      }
    )

  }

  prueba(){

    //Obtenemos el token y expirationdate desde el response del Api
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJjdXN0b21lcl91c2VyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJDdXN0b21lciBDdXN0b21lciIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkN1c3RvbWVyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjAyNS0xMC0xOVQwMzowNzo1OFoiLCJleHAiOjE3NjA4NDMyNzh9.P9aOrt74XwYyu7DI8w8qtkiDZRFO7wVljzPGAsRVPI0';
    const expirationdatetime = '2025-10-19T03:07:58Z' //Formato UTC

    //Seteamos el token y expirationdate en el Local Storage
    localStorage.setItem('token', token);
    localStorage.setItem('expirationdatetime', expirationdatetime);

    //Decodificar el token para setear los valores de los claims
    this.userService.decodeToken();

    alert('Bienvenido usuario: ' + this.userService.getName());

    //Navegamos al HOME por defecto
    this.router.navigateByUrl('/');

  }

}
