import { Routes } from '@angular/router';
import { Dashboard } from './admin/dashboard/dashboard';
import { Products } from './admin/dashboard/products/products';
import { ProductsForm } from './admin/dashboard/products-form/products-form';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'products', component: Products },
  { path: 'products/new', component: ProductsForm },
  { path: 'categories', component: Products },
];
