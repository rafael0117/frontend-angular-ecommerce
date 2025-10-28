// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Layouts
import { AdminLayout } from './admin/layout/admin-layout/admin-layout';

// Páginas públicas
import { HomePage } from './client/pages/home-page/home-page';
import { Cart } from './client/pages/cart/cart';
import { Pedido } from './client/pages/pedido/pedido';
import { AuthShellComponent } from './auth/AuthShellComponent';
// Si usas <app-register> como modal desde navbar, no necesitas ruta /register.
// Si igual quieres ruta directa:
import { Register } from './auth/register/register';

// Admin
import { Dashboard } from './admin/dashboard/dashboard';
import { Products } from './admin/dashboard/products/products';
import { ProductsForm } from './admin/dashboard/products-form/products-form';
import { Categories } from './admin/dashboard/categories/categories';
import { CategoriesForm } from './admin/dashboard/categories-form/categories-form';
import { PublicLayout } from './client/pages/public-layout/public-layout';
import { ProductDetail } from './client/pages/home/product-detail/product-detail';

export const routes: Routes = [
  // ====== LAYOUT PÚBLICO (Navbar + Footer) ======
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'product-detail/:id', component: ProductDetail },
      { path: 'carrito', component: Cart },
      { path: 'checkout', component: Pedido },
      { path: 'auth', component: AuthShellComponent }, // si quieres mantener el shell por URL
      { path: 'register', component: Register },       // opcional (si quieres ruta directa)
    ],
  },

  // ====== LAYOUT ADMIN (sin Navbar/Footer) ======
  {
    path: 'admin',
    component: AdminLayout,
    // canActivate: [AuthGuard, RoleAdminGuard], // si tienes guards
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'products', component: Products },
      { path: 'products/new', component: ProductsForm },
      { path: 'categories', component: Categories },
      { path: 'categories/new', component: CategoriesForm },
      { path: 'categories/:id/edit', component: CategoriesForm },
    ],
  },

  // 404
  { path: '**', redirectTo: '' },
];
