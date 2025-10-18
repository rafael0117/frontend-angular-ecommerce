import { Component } from '@angular/core';
import { ProductoService } from '../../../service/producto';
import { CategoriaService } from '../../../service/categoria';
import { Categoria } from '../../../interface/categoria';
import { Producto } from '../../../interface/producto';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-form',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './products-form.html',
  styleUrl: './products-form.css'
})
export class ProductsForm {
 categories: Categoria[] = [];
  product: Producto = { id: 0, nombre: '', descripcion: '', precio: 0, stock: 0,categoriaId:0, categoriaNombre: '', imagen: '', talla: [], color: [] };
  
  availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  availableColors = [
    { name: "Negro", value: "#000000" },
    { name: "Blanco", value: "#FFFFFF" },
    { name: "Gris", value: "#6B7280" },
    { name: "Azul", value: "#3B82F6" },
    { name: "Rojo", value: "#EF4444" },
    { name: "Verde", value: "#10B981" },
    { name: "Amarillo", value: "#F59E0B" },
    { name: "Rosa", value: "#EC4899" },
  ];

  selectedSizes: string[] = [];
  selectedColors: string[] = [];

  constructor(private productService: ProductoService, private categoryService: CategoriaService, public router: Router) {}

 ngOnInit(): void {
  this.categoryService.getCategorias().subscribe({
    next: (cats: Categoria[]) => {
      this.categories = cats;
    },
    error: (err) => console.error('Error al cargar categorías', err)
  });
}


  toggleSize(size: string) {
    this.selectedSizes.includes(size) ?
      this.selectedSizes = this.selectedSizes.filter(s => s !== size) :
      this.selectedSizes.push(size);
  }

  toggleColor(color: string) {
    this.selectedColors.includes(color) ?
      this.selectedColors = this.selectedColors.filter(c => c !== color) :
      this.selectedColors.push(color);
  }

  saveProduct() {
  if (!this.product.nombre || !this.product.precio || !this.product.categoriaNombre || this.selectedSizes.length === 0) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }

  this.product.talla = [...this.selectedSizes];
  this.product.color = [...this.selectedColors];

  if (this.product.id) {
    // Actualizar producto existente
    this.productService.updateProducto(this.product.id, this.product).subscribe(() => {
      this.router.navigate(['/dashboard/products']);
    });
  } else {
    // Crear producto nuevo
    this.product.id = Date.now()
    this.productService.addProducto(this.product).subscribe(() => {
      this.router.navigate(['/dashboard/products']);
    });
  }
}

}
