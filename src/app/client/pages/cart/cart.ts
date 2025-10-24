import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CarritoResponse, CarritoService, DetalleCarrito } from '../../../service/carrito';
import { Navbar } from "../layout/navbar/navbar";
import { Footer } from "../layout/footer/footer";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit{
   carrito$!: Observable<CarritoResponse | null>;
  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // ahora sí, carritoService ya está inyectado
    this.carrito$ = this.carritoService.carrito$;
  }

  trackByDetalle = (_: number, d: DetalleCarrito) => d.idProducto;

  eliminar(d: DetalleCarrito) {
    this.carritoService.eliminar(d.idProducto).subscribe();
  }

  vaciar() {
    this.carritoService.vaciar().subscribe();
  }

  continuarComprando() {
    this.router.navigate(['/']);
  }

  irAPagar() {
    // navega a tu ruta de checkout cuando la tengas
    this.router.navigate(['/checkout']);
  }

  total(cart: CarritoResponse | null): number {
    if (!cart?.detalles?.length) return 0;
    return cart.detalles.reduce((acc, d) => acc + (d.precio * d.cantidad), 0);
  }

  totalItems(cart: CarritoResponse | null): number {
    if (!cart?.detalles?.length) return 0;
    return cart.detalles.reduce((acc, d) => acc + d.cantidad, 0);
  }
}
