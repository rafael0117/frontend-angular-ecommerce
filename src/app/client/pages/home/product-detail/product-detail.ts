import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../../service/producto';
import { CarritoService } from '../../../../service/carrito';
import { AuthService } from '../../../../service/auth';
import { ToastrService } from 'ngx-toastr';
import { Producto } from '../../../../interface/producto';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail {
  producto: Producto | null = null;
  imagenPrincipal: string | null = null;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private carrito: CarritoService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.productoService.getProducto(+id).subscribe({
      next: (data) => {
        this.producto = data;
        this.imagenPrincipal = this.getImagenPrincipal();
      },
      error: () => this.toastr.error('No se pudo cargar el producto'),
    });
  }

  setImagenPrincipal(img: string) {
    this.imagenPrincipal = img;
  }

  getImagenPrincipal(): string {
    const img = this.imagenPrincipal || this.producto?.imagenesBase64?.[0];
    return img && img.length > 50 ? img : 'assets/images/placeholder.jpg';
  }

  agregarAlCarrito() {
    if (!this.auth.isAuthenticated()) {
      this.toastr.info('Inicia sesión para agregar al carrito');
      return;
    }

    if (!this.producto) return;

    if (!this.selectedSize || !this.selectedColor) {
      this.toastr.warning('Selecciona talla y color antes de añadir');
      return;
    }

    this.loading = true;
    this.carrito.agregar({
      idProducto: this.producto.id,
      cantidad: 1,
      talla: this.selectedSize,
      color: this.selectedColor
    }).subscribe({
      next: () => this.toastr.success('Producto agregado al carrito'),
      error: () => this.toastr.error('No se pudo agregar al carrito'),
      complete: () => (this.loading = false),
    });
  }

  // === Helpers para color ===
  cssColor(input: string): string {
    if (!input) return '#eee';
    const v = ('' + input).trim().toLowerCase();
    const map: Record<string, string> = {
      negro: '#000', blanco: '#fff', azul: '#2563eb', rojo: '#ef4444',
      verde: '#22c55e', amarillo: '#eab308', marron: '#8b5e3c',
      gris: '#6b7280', morado: '#8b5cf6', rosa: '#f472b6',
    };
    if (map[v]) return map[v];
    if (v.startsWith('#')) return v;
    return '#ddd';
  }

  humanColor(input: string): string {
    const v = input.toLowerCase();
    const nombres: Record<string, string> = {
      '#000': 'Negro', '#fff': 'Blanco', '#2563eb': 'Azul',
      '#ef4444': 'Rojo', '#22c55e': 'Verde', '#eab308': 'Amarillo',
      '#8b5e3c': 'Marrón', '#6b7280': 'Gris', '#8b5cf6': 'Morado', '#f472b6': 'Rosa'
    };
    return nombres[v] || input;
  }
}
