import { Routes } from '@angular/router';
import { HelloWorld } from './hello-world/hello-world';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Admin } from './admin/admin';
import { Customer } from './customer/customer';
import { ProductDetail } from './product-detail/product-detail';
import { ShoppingCar } from './shopping-car/shopping-car';
import { Product } from './admin/product/product';
import { Category } from './admin/category/category';
import { Sales } from './admin/sales/sales';
import { RegisterProduct } from './admin/product/register-product/register-product';
import { ListProduct } from './admin/product/list-product/list-product';
import { Reports } from './admin/reports/reports';

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
  {
    path: 'shopping-car',
    component: ShoppingCar,
  },
  {
    path: 'admin',
    pathMatch: 'prefix',
    component: Admin,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sales', //por default redirige a 'sales'
      },
      {
        path: 'sales',
        component: Sales,
      },
      {
        path: 'category',
        component: Category,
      },
      {
        path: 'products',
        pathMatch: 'prefix',
        component: Product,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'register-product', //por default redirige a 'sales'
          },
          {
            path: 'register-product',
            component: RegisterProduct,
          },
          {
            path: 'list-product',
            component: ListProduct,
          },
        ],
      },
      {
        path: 'reports',
        component: Reports,
      },
    ],
  },
];
