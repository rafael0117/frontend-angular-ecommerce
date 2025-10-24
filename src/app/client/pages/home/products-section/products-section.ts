import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductoService } from '../../../../service/producto';
import { Producto } from '../../../../interface/producto';

import { AuthService } from '../../../../service/auth';
import { CarritoService } from '../../../../service/carrito';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-section.html',
  styleUrls: ['./products-section.css']
})
export class ProductsSection implements OnInit {
  productos: Producto[] = [];
  loadingId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private carrito: CarritoService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        // Normaliza por si alguna imagen viniera sin prefijo data:
        this.productos = (data || []).map(p => ({
          ...p,
          imagenesBase64: (p.imagenesBase64 || []).map(img =>
            img?.startsWith('data:image/') ? img : `data:image/jpeg;base64,${img}`
          )
        }));
      },
      error: () => this.toastr.error('No se pudo cargar los productos')
    });
  }

  // Imagen principal (con fallback)
  getImagen(prod: Producto): string {
    const img = prod?.imagenesBase64?.[0];
    return img && img.length > 50 ? img : 'assets/images/placeholder.jpg';
  }

  // Cambia la imagen principal por la thumbnail clickeada
  cambiarImagen(prod: Producto, index: number) {
    if (!prod?.imagenesBase64?.[index]) return;
    const imgs = [...prod.imagenesBase64];
    [imgs[0], imgs[index]] = [imgs[index], imgs[0]];
    prod.imagenesBase64 = imgs;
  }

  // Si falla la carga, usa placeholder
  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/images/placeholder.jpg';
  }

  agregar(producto: Producto) {
    if (!this.auth.isAuthenticated()) {
      this.toastr.info('Inicia sesión para agregar al carrito');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.loadingId = producto.id;
    this.carrito.agregar({ idProducto: producto.id, cantidad: 1 }).subscribe({
      next: () => this.toastr.success('Producto agregado al carrito'),
      error: () => this.toastr.error('No se pudo agregar al carrito'),
      complete: () => (this.loadingId = null)
    });
  }
}
