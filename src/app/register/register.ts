import { Component, inject } from '@angular/core';
import { UserService } from '../shared/services/user-service/user-service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiRegisterUserRequest, ApiRegisterUserResponse } from '../shared/models/usuario-model';
import { Router, RouterLink } from '@angular/router';
import { SimpleHeader } from '../shared/components/simple-header/simple-header';
import { Footer } from '../shared/components/footer/footer';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  imports: [
    SimpleHeader,
    Footer,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private userService: UserService = inject(UserService);
  private router = inject(Router);

  //REGEX para ingresar al menos un dígito numérico del 0 al 9
  readonly regexDigito = /.*[0-9].*/;
  //REGEX para ingresar un nombre de usuario (Permite letras, números, punto, guion y subguion)
  readonly regexUser = /^[a-zA-Z0-9._-]+$/;
  //REGEX para ingresar un entero positivo (edad)
  readonly regexEnteroPositivo = /^[0-9]+$/;
  //REGEX solo número y/o letras (número de documento)
  readonly regexDocumentNumber = /^[a-zA-Z0-9]+$/;

  registerUserForm: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    lastname: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    age: new FormControl('', [
      Validators.required,
      Validators.min(18),
      Validators.max(80),
      Validators.pattern(this.regexEnteroPositivo),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      Validators.pattern(this.regexUser),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.regexDigito),
    ]),
    documenttype: new FormControl('0', [Validators.required]), //selector
    documentnumber: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(this.regexDocumentNumber)]),
  });

  registerUser() {
    const userData: ApiRegisterUserRequest = {
      FirstName: this.registerUserForm.controls['firstname'].value!,
      LastName: this.registerUserForm.controls['lastname'].value!,
      Age: this.registerUserForm.controls['age'].value!,
      UserName: this.registerUserForm.controls['username'].value!,
      Email: this.registerUserForm.controls['email'].value!,
      Password: this.registerUserForm.controls['password'].value!,
      ConfirmPassword: this.registerUserForm.controls['password'].value!, //por simplicidad, se envía la misma contraseña
      DocumentType: parseInt(this.registerUserForm.controls['documenttype'].value!),
      DocumentNumber: this.registerUserForm.controls['documentnumber'].value!,
    };

    //Ejecutar el método registerUser del UserService
    this.userService.registerUser(userData).subscribe((resp: ApiRegisterUserResponse) => {
      console.log('Registro de usuario exitoso con Id: ', resp.Data.UserId);
      alert('¡Registro de usuario exitoso!');
      this.router.navigateByUrl('/login');
    });
  }
}
