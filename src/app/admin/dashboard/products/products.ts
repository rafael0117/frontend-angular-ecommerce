import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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

  // categorías
  categories: Categoria[] = [];
  categoriesMap: Record<string | number, string> = {};

  // modal
  showModal = false;
  isEdit = false;

  // formulario
  form: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 0,
    categoriaNombre: '',
    talla: [],
    color: [],
    imagenesBase64: []
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

  // previews locales
  previews: string[] = [];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.categoriaService.getCategorias().subscribe({
      next: cats => {
        this.categories = cats ?? [];
        this.categoriesMap = Object.fromEntries(
          (cats ?? []).map(c => [c.id, c.nombre])
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

  // --------- Guardar ----------
  save(f: NgForm): void {
    if (f.invalid || !this.form.precio || this.form.precio <= 0 || !this.form.categoriaId || this.form.talla.length === 0) {
      alert('Completa nombre, precio (>0), categoría y al menos una talla.');
      return;
    }

    // (opcional) setear nombre categoría para mostrar en tabla local sin esperar respuesta
    const cat = this.categories.find(c => ('' + c.id) === ('' + this.form.categoriaId));
    this.form.categoriaNombre = cat?.nombre || '';

    const payload: Omit<Producto, 'id'> = {
      nombre: this.form.nombre,
      descripcion: this.form.descripcion || '',
      precio: Number(this.form.precio),
      stock: Number(this.form.stock || 0),
      categoriaId: Number(this.form.categoriaId),
      categoriaNombre: this.form.categoriaNombre, // el back puede ignorarlo
      talla: [...(this.form.talla || [])],
      color: [...(this.form.color || [])],
      imagenesBase64: [...(this.form.imagenesBase64 || [])]
    };

    const obs = this.isEdit && this.form.id
      ? this.productoService.updateProducto(this.form.id, payload)
      : this.productoService.addProducto(payload);

    obs.subscribe({
      next: () => { this.closeModal(); this.loadProducts(); },
      error: e => console.error('Error guardando', e)
    });
  }

  // --------- Eliminar ----------
  delete(p: Producto): void {
    if (!confirm(`Eliminar ${p.nombre}?`)) return;
    this.productoService.deleteProducto(p.id).subscribe({
      next: () => this.loadProducts(),
      error: e => console.error('Error eliminando', e)
    });
  }

  // --------- Modal ----------
  openNew(): void {
    this.isEdit = false;
    this.form = {
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoriaId: 0,
      categoriaNombre: '',
      talla: [],
      color: [],
      imagenesBase64: []
    };
    this.previews = [];
    this.showModal = true;
  }

  openEdit(p: Producto): void {
    this.isEdit = true;
    this.form = {
      ...p,
      categoriaId: Number(p.categoriaId),
      talla: [...(p.talla || [])],
      color: [...(p.color || [])],
      imagenesBase64: [...(p.imagenesBase64 || [])]
    };
    this.previews = [...(this.form.imagenesBase64 || [])]; // mostrar lo que viene del back
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  // --------- Tallas/colores ----------
  toggleSize(size: string): void {
    const i = this.form.talla.indexOf(size);
    i >= 0 ? this.form.talla.splice(i, 1) : this.form.talla.push(size);
  }

  toggleColor(color: string): void {
    const i = this.form.color.indexOf(color);
    i >= 0 ? this.form.color.splice(i, 1) : this.form.color.push(color);
  }

  // --------- Imágenes múltiples (base64) ----------
  onFilesSelected(evt: any): void {
    const files: FileList | undefined = evt.target?.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const b64 = reader.result as string; // data:image/...;base64,XXXX
        this.form.imagenesBase64.push(b64);
        this.previews.push(b64);
      };
      reader.readAsDataURL(file);
    });

    // permite volver a seleccionar las mismas imágenes
    evt.target.value = '';
  }

  removeImageAt(i: number): void {
    this.form.imagenesBase64.splice(i, 1);
    this.previews.splice(i, 1);
  }
}
