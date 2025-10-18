import { Component } from '@angular/core';
import { Producto } from '../../../interface/producto';
import { ProductoService } from '../../../service/producto';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../service/categoria';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
 products: Producto[] = [];
  categoriesMap: Record<string, string> = {};

  constructor(
    private productService: ProductoService,
    private categoryService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProductos().subscribe((products: Producto[]) => {
      this.products = products;
    });
    this.categoryService.getCategorias().subscribe((categories) => {
      this.categoriesMap = categories.reduce((acc, cat) => {
        acc[cat.id] = cat.nombre;
        return acc;
      }, {} as Record<string, string>);
    });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProducto(id);
      this.loadProducts();
    }
  }

  goToNewProduct(): void {
    this.router.navigate(['/dashboard/products/new']);
  }
}
