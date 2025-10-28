import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductoService } from '../../../../service/producto';
import { Producto } from '../../../../interface/producto';
import { AuthService } from '../../../../service/auth';
import { CarritoService } from '../../../../service/carrito';
import { Login } from "../../../../auth/login/login";

@Component({
  selector: 'app-offers-section',
  standalone: true,
  imports: [CommonModule, Login],
  templateUrl: './offers-section.html',
  styleUrls: ['./offers-section.css']
})
export class OffersSection implements OnInit {
  productos: Producto[] = [];
  loadingId: number | null = null;
  showLoginModal = false;

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
        const all = (data || []).map(p => ({
          ...p,
          imagenesBase64: (p.imagenesBase64 || []).map(img =>
            img?.startsWith('data:image/') ? img : `data:image/jpeg;base64,${img}`
          )
        }));

        // 🔹 Solo MUJERES (robusto a mayúsculas/minúsculas y nulos)
        this.productos = all.filter(p =>
          (p as any)?.categoriaSexo?.toString().toUpperCase() === 'MUJER'
        );
      },
      error: () => this.toastr.error('No se pudo cargar los productos')
    });
  }

  // Imagen principal
  getImagen(prod: Producto): string {
    const img = prod?.imagenesBase64?.[0];
    return img && img.length > 50 ? img : 'assets/images/placeholder.jpg';
  }

  cambiarImagen(prod: Producto, index: number) {
    if (!prod?.imagenesBase64?.[index]) return;
    const imgs = [...prod.imagenesBase64];
    [imgs[0], imgs[index]] = [imgs[index], imgs[0]];
    prod.imagenesBase64 = imgs;
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/images/placeholder.jpg';
  }

  verMas(producto: Producto) {
    this.router.navigate(['/product-detail', producto.id]);
  }
}
