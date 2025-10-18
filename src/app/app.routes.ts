// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AdminLayout } from './admin/layout/admin-layout/admin-layout';
import { Dashboard } from './admin/dashboard/dashboard';
import { Products } from './admin/dashboard/products/products';
import { ProductsForm } from './admin/dashboard/products-form/products-form';
import { Categories } from './admin/dashboard/categories/categories';
import { CategoriesForm } from './admin/dashboard/categories-form/categories-form';

// TODO: cuando tengas Categories, impórtalo y cámbialo aquí
// import { Categories } from './admin/dashboard/categories/categories';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayout,   // ← pinta el sidebar y el <router-outlet> interno
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: Dashboard },
      { path: 'products', component: Products },
      { path: 'products/new', component: ProductsForm },

      // temporal: apunta a Products hasta que crees Categories
      { path: 'categories', component: Categories },
      { path: 'categories/new', component: CategoriesForm },
      { path: 'categories/:id/edit', component: CategoriesForm }
    ]
  }
];
