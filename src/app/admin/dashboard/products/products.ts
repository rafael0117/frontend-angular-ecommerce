// src/app/pages/products/products.ts
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
  // Tabla
  products: Producto[] = [];

  // Categorías
  categories: Categoria[] = [];
  categoriesMap: Record<string | number, string> = {};

  // Modal
  showModal = false;
  isEdit = false;

  // Formulario
  form: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 0,
    categoriaNombre: '',
    categoriaSexo: '' as any,  // será 'HOMBRE' | 'MUJER'
    talla: [],
    color: [],
    imagenesBase64: []
  };

  // Helpers UI
  availableSexos: Array<'HOMBRE' | 'MUJER'> = ['HOMBRE', 'MUJER'];
  availableSubcategorias = [
    'CAMISA', 'POLO', 'PANTALON', 'JEAN', 'SHORT',
    'FALDA', 'VESTIDO', 'CHOMPA', 'CASACA', 'ZAPATO', 'ZAPATILLA', 'ACCESORIO'
  ];

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

  // Previews locales
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
        this.categoriesMap = Object.fromEntries((cats ?? []).map(c => [c.id, c.nombre]));
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
    const precioOk = this.form.precio && this.form.precio > 0;
    const categoriaOk = !!this.form.categoriaId;
    const sexoOk = this.form.categoriaSexo === 'HOMBRE' || this.form.categoriaSexo === 'MUJER';
    const tallaOk = this.form.talla.length > 0;

    if (f.invalid || !precioOk || !categoriaOk || !sexoOk || !tallaOk) {
      alert('Completa: Nombre, Precio (>0), Categoría, Sexo y al menos una Talla.');
      return;
    }

    // setear nombre de categoría para la tabla local
    const cat = this.categories.find(c => ('' + c.id) === ('' + this.form.categoriaId));
    this.form.categoriaNombre = cat?.nombre || '';

    // Payload limpio (sin id)
    const payload: Omit<Producto, 'id'> = {
      nombre: this.form.nombre.trim(),
      descripcion: (this.form.descripcion || '').trim(),
      precio: Number(this.form.precio),
      stock: Number(this.form.stock || 0),
      categoriaId: Number(this.form.categoriaId),
      categoriaNombre: this.form.categoriaNombre,
      categoriaSexo: this.form.categoriaSexo,
      talla: [...(this.form.talla || [])],
      color: [...(this.form.color || [])],
      imagenesBase64: [...(this.form.imagenesBase64 || [])]
    };

    const obs = this.isEdit && this.form.id
      ? this.productoService.updateProducto(this.form.id, payload)
      : this.productoService.addProducto(payload);

    obs.subscribe({
      next: () => {
        this.closeModal();
        this.loadProducts();
      },
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
      categoriaSexo: '' as any,
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
      categoriaSexo: p.categoriaSexo as any,
      talla: [...(p.talla || [])],
      color: [...(p.color || [])],
      imagenesBase64: [...(p.imagenesBase64 || [])]
    };
    this.previews = [...(this.form.imagenesBase64 || [])];
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

    // Permite volver a seleccionar las mismas imágenes
    evt.target.value = '';
  }

  removeImageAt(i: number): void {
    this.form.imagenesBase64.splice(i, 1);
    this.previews.splice(i, 1);
  }

  // --------- TrackBy para tabla ----------
  trackByProductId = (_: number, p: Producto) => p.id;
}
