import { Routes } from '@angular/router';
import { HelloWorld } from './hello-world/hello-world';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Admin } from './admin/admin';
import { Customer } from './customer/customer';
import { ProductDetail } from './product-detail/product-detail';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'admin',
    component: Admin,
  },
  {
    path: 'customer',
    component: Customer,
  },
  {
    path: 'product-detail',
    pathMatch: 'full',
    redirectTo: '', //Redirigir a home si no se proporciona un id de producto en la ruta
  },
   {
    path: 'product-detail/:id',
    pathMatch: 'full',
    component: ProductDetail,
  },
];
