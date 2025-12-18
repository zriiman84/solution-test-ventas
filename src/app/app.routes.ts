import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Admin } from './admin/admin';
import { Customer } from './customer/customer';
import { ProductDetail } from './product-detail/product-detail';
import { ShoppingCar } from './shopping-car/shopping-car';
import { Product } from './admin/product/product';
import { Sales } from './admin/sales/sales';
import { Category } from './admin/category/category';
import { Reports } from './admin/reports/reports';
import { RegisterProduct } from './admin/product/register-product/register-product';
import { ListProduct } from './admin/product/list-product/list-product';
import { RegisterCategory } from './admin/category/register-category/register-category';
import { ListCategory } from './admin/category/list-category/list-category';
import { MyPurchases } from './customer/my-purchases/my-purchases';
import { ChangePassword } from './customer/change-password/change-password';

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
    path: 'customer',
    pathMatch: 'prefix',
    component: Customer,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'my-purchases', //por default redirige a 'my-purchases'
      },
      {
        path: 'my-purchases',
        component: MyPurchases,
      },
      {
        path: 'change-password',
        component: ChangePassword,
      },
    ]
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
        pathMatch: 'prefix',
        component: Category,
         children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'register-category', //por default redirige a 'register-category'
          },
          {
            path: 'register-category',
            component: RegisterCategory,
          },
          {
            path: 'list-category',
            component: ListCategory,
          },
        ],
      },
      {
        path: 'products',
        pathMatch: 'prefix',
        component: Product,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'register-product', //por default redirige a 'register-product'
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
