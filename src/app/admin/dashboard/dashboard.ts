import { Component, OnInit } from '@angular/core';

import { ProductoService } from '../../service/producto';
import { CategoriaService } from '../../service/categoria';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})

export class Dashboard implements OnInit {
  stats = {
    totalProducts: 0,
    totalCategories: 0,
    totalValue: 0,
    lowStock: 0,
  };


constructor(private producto: ProductoService,
            private categoria: CategoriaService) {}


ngOnInit(): void {
  forkJoin({
    products: this.producto.getProductos(),
    categories: this.categoria.getCategorias()
  }).subscribe(({ products, categories }) => {
    this.stats.totalProducts   = products.length;
    this.stats.totalCategories = categories.length;
    this.stats.totalValue      = products.reduce((s,p)=> s + (p.precio??0)*(p.stock??0), 0);
    this.stats.lowStock        = products.filter(p => (p.stock??0) < 10).length;
  });
}
}