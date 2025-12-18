import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../shared/services/user-service/user-service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { ApiResetPasswordRequest } from '../../shared/models/usuario.model';
import { Router } from '@angular/router';
import { BaseResponse } from '../../shared/models/generic.model';

@Component({
  selector: 'app-reset-password-dialog',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './reset-password-dialog.html',
  styleUrl: './reset-password-dialog.css',
})
export class ResetPasswordDialog {

  private userService = inject(UserService);

  private router = inject(Router);

  // Desde "forgot-password" recibiré un objeto que tendrá un atributo email .
  data = inject(MAT_DIALOG_DATA) as { email: string };

  // Esto es para poder referenciar al modal y poder realizar funciones sobre ella, como por ejemplo cerrar la ventana.
  private dialogRef = inject(DialogRef);

  ResetPassword(form: NgForm)
  {
    const resetPasswordData: ApiResetPasswordRequest = {
      email: this.data.email,
      token: form.controls['tokenInput'].value!,
      newPassword: form.controls['passwordInput'].value!,
      confirmNewPassword: form.controls['confirmPasswordInput'].value!,
    };

    //Validar que las contraseñas coincidan
    if(!this.validarContrasenias(resetPasswordData.newPassword, resetPasswordData.confirmNewPassword)){
      alert('¡Las contraseñas no coinciden!');
      return;
    }

    //Llamo al servicio para resetear la contraseña
    this.userService.ResetPassword(resetPasswordData).subscribe((resp: BaseResponse) => {

      alert('¡Contraseña actualizada! - ' + resp.message);
      this.router.navigateByUrl('/login');
      //Cierro el modal
      this.dialogRef.close();
    });
  }

  validarContrasenias(password: string, confirmPassword: string): boolean {
    if(password !== confirmPassword){
      return false;
    }
    return true;
  }

  //Otra forma de crear errores personalizados, invocado desdde el input como (ngModelChange)="verifyPasswords(resetPasswordForm)"
  /*verifyPasswords(form: NgForm) {
    const passwordInput = form.controls['passwordInput'];
    const confirmNewPasswordInput = form.controls['confirmPasswordInput'];

    if(passwordInput.value && confirmNewPasswordInput.value && passwordInput.value === confirmNewPasswordInput.value) {
      confirmNewPasswordInput.setErrors(null);
    }else{
      confirmNewPasswordInput.setErrors({ isMatch: true }); // Establece un error personalizado 'isMatch'
    }
  }*/


}
