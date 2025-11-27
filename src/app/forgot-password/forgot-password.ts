import { Component, inject } from '@angular/core';
import { SimpleHeader } from '../shared/components/simple-header/simple-header';
import { Footer } from '../shared/components/footer/footer';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../shared/services/user-service/user-service';
import { BaseResponse } from '../shared/models/usuario-model';

@Component({
  selector: 'app-forgot-password',
  imports: [SimpleHeader, Footer, MatFormFieldModule, MatButtonModule, MatInputModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  private userService: UserService = inject(UserService);

  requestToken(emailInput: string) {
    this.userService.requestTokenToResetPassword(emailInput).subscribe((resp : BaseResponse) => {
        alert(resp.message);
        //TO-DO
        // Modal Reset Password
    });
  }

}
