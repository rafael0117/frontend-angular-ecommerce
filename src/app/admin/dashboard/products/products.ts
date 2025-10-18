import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../service/producto';
import { CategoriaService } from '../../../service/categoria';
import { Producto } from '../../../interface/producto';
import { Categoria } from '../../../interface/categoria';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html'
})
export class Products implements OnInit {
  // tabla
  products: Producto[] = [];

  // ✅ Opción 1: lista de categorías + (opcional) map
  categories: Categoria[] = [];                       // ← aquí la lista
  categoriesMap: Record<string | number, string> = {}; // ← opcional

  // modal
  showModal = false;
  isEdit = false;

  // modelo del formulario
  form: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 0,
    categoriaNombre: '',
    imagen: '',
    talla: [],
    color: []
  };

  // helpers UI
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

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // ✅ Cargar categorías y rellenar lista + mapa
    this.categoriaService.getCategorias().subscribe({
      next: cats => {
        this.categories = cats ?? [];
        this.categoriesMap = Object.fromEntries(
          (cats ?? []).map(c => [c.id, c.descripcion])
        );
      },
      error: e => console.error('Error cargando categorías', e)
    });
  }

  loadProducts(): void {
    this.productoService.getProductos().subscribe({
      next: list => (this.products = list || []),
      error: e => console.error('Error cargando productos', e)
    });
  }

   // guardar
  save(): void {
    if (!this.form.nombre?.trim() || !this.form.precio || !this.form.categoriaId || this.form.talla.length === 0) {
      alert('Completa nombre, precio, categoría y al menos una talla.');
      return;
    }

    // ✅ Tomar el nombre de categoría desde la lista cargada
    const cat = this.categories.find(c => ('' + c.id) === ('' + this.form.categoriaId));
    this.form.categoriaNombre = cat?.descripcion || '';

    if (this.isEdit && this.form.id) {
      this.productoService.updateProducto(this.form.id, this.form).subscribe({
        next: () => { this.closeModal(); this.loadProducts(); },
        error: e => console.error('Error actualizando', e)
      });
    } else {
      this.form.id = Date.now(); // si backend lo genera, quita esta línea
      this.productoService.addProducto(this.form).subscribe({
        next: () => { this.closeModal(); this.loadProducts(); },
        error: e => console.error('Error creando', e)
      });
    }
  }

  // (opcional) eliminar
  delete(p: Producto): void {
    if (!confirm(`Eliminar ${p.nombre}?`)) return;
    this.productoService.deleteProducto(p.id).subscribe({
      next: () => this.loadProducts(),
      error: e => console.error('Error eliminando', e)
    });
  }


  /// MODAL METHODS
  // abrir modal - nuevo
  openNew(): void {
    this.isEdit = false;
    this.form = {
      id: 0, nombre: '', descripcion: '', precio: 0, stock: 0,
      categoriaId: 0, categoriaNombre: '', imagen: '', talla: [], color: []
    };
    this.showModal = true;
  }

  // abrir modal - editar
  openEdit(p: Producto): void {
    this.isEdit = true;
    this.form = { ...p, talla: [...(p.talla || [])], color: [...(p.color || [])] };
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  // toggles UI
  toggleSize(size: string): void {
    const i = this.form.talla.indexOf(size);
    i >= 0 ? this.form.talla.splice(i, 1) : this.form.talla.push(size);
  }
  toggleColor(color: string): void {
    const i = this.form.color.indexOf(color);
    i >= 0 ? this.form.color.splice(i, 1) : this.form.color.push(color);
  }

 


 // Propiedad para preview
imagePreview: string | ArrayBuffer | null = null;

// Al seleccionar archivo local
onFileSelected(event: any): void {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result;
    this.form.imagen = reader.result as string; // guarda base64
  };
  reader.readAsDataURL(file);
}

// Quitar imagen
removeImage(): void {
  this.imagePreview = null;
  this.form.imagen = '';
}


}
