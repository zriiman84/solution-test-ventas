import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../shared/services/user-service/user-service';
import { ApiChangePasswordRequest } from '../../shared/models/usuario.model';
import { BaseResponse } from '../../shared/models/generic.model';

@Component({
  selector: 'app-change-password',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatButton, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword implements OnInit {

  //REGEX para ingresar al menos un dígito numérico del 0 al 9
  readonly regexDigito = /.*[0-9].*/;

  userService = inject(UserService);

  changePasswordForm!: FormGroup;

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      OldPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.regexDigito), //validar que sea email o username
      ]),
      NewPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.regexDigito),
      ]),
    });
  }

  cambiarPassword() {
    const requestChangePassword: ApiChangePasswordRequest = {
      OldPassword: this.changePasswordForm.controls['OldPassword'].value!,
      NewPassword: this.changePasswordForm.controls['NewPassword'].value!,
    };

    this.userService.changePassword(requestChangePassword).subscribe((resp : BaseResponse) => {
      alert('¡Cambio de contraseña exitoso! Se ha enviado un correo de confirmación.');
      this.resetFormulario();
    });
  }


  resetFormulario() {
    //1. Resetear el formulario con valores iniciales del NgOnInit
    this.changePasswordForm.reset();

    //2. Recorrer cada control y marcarlo como "no tocado" (Untouched)
    //Esto remueve las clases CSS de error de Angular y oculta los mat-error.
    Object.keys(this.changePasswordForm.controls).forEach((key) => {
      const control = this.changePasswordForm.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
      }
    });

    //3. Marcar el FormGroup completo como no tocado
    this.changePasswordForm.markAsUntouched();
    this.changePasswordForm.markAsPristine();
  }
}
