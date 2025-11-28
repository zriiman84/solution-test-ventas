import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logged-in-header',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './logged-in-header.html',
  styleUrl: './logged-in-header.css',
})
export class LoggedInHeader {

  userService = inject(UserService);

  logout(){
    this.userService.logout(false);
  }

}
