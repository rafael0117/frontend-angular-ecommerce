import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../service/producto';
import { CategoriaService } from '../../../service/categoria';
import { Categoria } from '../../../interface/categoria';
import { Producto } from '../../../interface/producto';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products-form.html',
  styleUrl: './products-form.css'
})
export class ProductsForm implements OnInit {
  categories: Categoria[] = [];
  availableSexos: Array<'HOMBRE' | 'MUJER'> = ['HOMBRE', 'MUJER']; // 👈 nuevo campo

  // Objeto del producto
  product: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 0,
    categoriaNombre: '',
    categoriaSexo: '' as any, // 👈 obligatorio
    imagenesBase64: [],
    talla: [],
    color: []
  };

  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  availableColors = [
    { name: 'Negro', value: '#000000' },
    { name: 'Blanco', value: '#FFFFFF' },
    { name: 'Gris', value: '#6B7280' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Amarillo', value: '#F59E0B' },
    { name: 'Rosa', value: '#EC4899' }
  ];

  selectedSizes: string[] = [];
  selectedColors: string[] = [];

  constructor(
    private productService: ProductoService,
    private categoryService: CategoriaService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategorias().subscribe({
      next: (cats: Categoria[]) => (this.categories = cats),
      error: err => console.error('Error al cargar categorías', err)
    });
  }

  toggleSize(size: string): void {
    this.selectedSizes.includes(size)
      ? (this.selectedSizes = this.selectedSizes.filter(s => s !== size))
      : this.selectedSizes.push(size);
  }

  toggleColor(color: string): void {
    this.selectedColors.includes(color)
      ? (this.selectedColors = this.selectedColors.filter(c => c !== color))
      : this.selectedColors.push(color);
  }

  saveProduct(): void {
    if (
      !this.product.nombre ||
      !this.product.precio ||
      this.product.precio <= 0 ||
      !this.product.categoriaId ||
      !this.product.categoriaSexo ||
      this.selectedSizes.length === 0
    ) {
      alert('Por favor completa todos los campos requeridos: nombre, precio, categoría, sexo y tallas.');
      return;
    }

    // Asignar tallas y colores seleccionados
    this.product.talla = [...this.selectedSizes];
    this.product.color = [...this.selectedColors];

    // Si el usuario pone una URL de imagen simple, guardamos como array
    if (typeof this.product.imagenesBase64 === 'string') {
      this.product.imagenesBase64 = [this.product.imagenesBase64];
    }

    const request$ = this.product.id
      ? this.productService.updateProducto(this.product.id, this.product)
      : this.productService.addProducto(this.product);

    request$.subscribe({
      next: () => this.router.navigate(['/dashboard/products']),
      error: e => console.error('Error al guardar producto', e)
    });
  }
}
