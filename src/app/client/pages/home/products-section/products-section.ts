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
  styleUrls: ['./products-section.css'] // <- estaba "styleUrl"
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
      next: (data) => this.productos = data,
      error: () => this.toastr.error('No se pudo cargar los productos')
    });
  }

  agregar(producto: Producto) {
    // 1) Requerir sesión
    if (!this.auth.isAuthenticated()) {
      this.toastr.info('Inicia sesión para agregar al carrito');
      // Si prefieres abrir tu modal en lugar de navegar, dispara tu mecanismo de modal aquí.
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // 2) Agregar al carrito
    this.loadingId = producto.id;
    this.carrito.agregar({ idProducto: producto.id, cantidad:1 }).subscribe({
      next: () => this.toastr.success('Producto agregado al carrito'),
      error: () => this.toastr.error('No se pudo agregar al carrito'),
      complete: () => this.loadingId = null
    });
  }
}
