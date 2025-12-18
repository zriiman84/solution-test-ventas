import { Component, inject } from '@angular/core';
import { UserService } from '../shared/services/user-service/user-service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiRegisterUserRequest, ApiRegisterUserResponse } from '../shared/models/usuario.model';
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

// Versión: Al menos 1 número y Al menos 1 Mayúscula (sin obligar minúsculas) y caracteres especiales.
readonly regexPassword = /^(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9.!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;
  //REGEX para ingresar un nombre de usuario (Permite letras, números, punto, guion y subguion) - al menos una letra
  readonly regexUser = /^(?=.*[a-zA-Z])[a-zA-Z0-9._-]+$/;
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
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.regexPassword),
    ]),
    documenttype: new FormControl('', [Validators.required]), //selector
    documentnumber: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(this.regexDocumentNumber)]),
  });

  registerUser() {
    const userData: ApiRegisterUserRequest = {
      firstName: this.registerUserForm.controls['firstname'].value!.trim() ,
      lastName: this.registerUserForm.controls['lastname'].value!.trim(),
      age: this.registerUserForm.controls['age'].value!,
      userName: this.registerUserForm.controls['username'].value!.trim(),
      email: this.registerUserForm.controls['email'].value!.trim(),
      password: this.registerUserForm.controls['password'].value!,
      confirmPassword: this.registerUserForm.controls['password'].value!, //por simplicidad, se envía la misma contraseña
      documentType: parseInt(this.registerUserForm.controls['documenttype'].value!),
      documentNumber: this.registerUserForm.controls['documentnumber'].value!.trim(),
    };

    if(userData.userName.trim().toLowerCase() === userData.email.trim().toLowerCase()){
      alert('El campo Usuario e Email no pueden ser iguales.');
      return;
    }

    //Ejecutar el método registerUser del UserService
    this.userService.registerUser(userData).subscribe((resp: ApiRegisterUserResponse) => {
      alert('¡Registro de usuario exitoso!');
      this.router.navigateByUrl('/login');
    });
  }

   resetFormulario(){
    //1. Resetear el formulario con valores iniciales del NgOnInit
    this.registerUserForm.reset();

    //2. Recorrer cada control y marcarlo como "no tocado" (Untouched)
    //Esto remueve las clases CSS de error de Angular y oculta los mat-error.
    Object.keys(this.registerUserForm.controls).forEach(key => {
        const control = this.registerUserForm.get(key);
        if (control) {
            control.markAsUntouched();
            control.markAsPristine();
        }
    });

    //3. Marcar el FormGroup completo como no tocado
    this.registerUserForm.markAsUntouched();
    this.registerUserForm.markAsPristine();
  }
}
