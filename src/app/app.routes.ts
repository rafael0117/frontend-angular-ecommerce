// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Público
import { ProductsSection } from './client/pages/home/products-section/products-section';

import { Login } from './auth/login/login';

// Admin
import { AdminLayout } from './admin/layout/admin-layout/admin-layout';
import { Dashboard } from './admin/dashboard/dashboard';
import { Products } from './admin/dashboard/products/products';
import { ProductsForm } from './admin/dashboard/products-form/products-form';
import { Categories } from './admin/dashboard/categories/categories';
import { CategoriesForm } from './admin/dashboard/categories-form/categories-form';
import { Cart } from './client/pages/cart/cart';
import { HomePage } from './client/pages/home-page/home-page';



export const routes: Routes = [
  // === Público (similar a: '', login, register, viajes-destino/:id, viaje/:id) ===
  { path: '', component: HomePage },          // Home (listado)
  { path: 'login', component: Login },

  // Detalle de producto (equivalente a viaje/:id)

  // Carrito (equivalente a otra página pública)
  { path: 'carrito', component: Cart },

  // === Admin con children (similar a dashboard con hijos) ===
  {
    path: 'admin',
    component: AdminLayout,

    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'products', component: Products },
      { path: 'products/new', component: ProductsForm },
      { path: 'categories', component: Categories },
      { path: 'categories/new', component: CategoriesForm },
      { path: 'categories/:id/edit', component: CategoriesForm }
    ]
  },

  // 404
  { path: '**', redirectTo: '' }
];
