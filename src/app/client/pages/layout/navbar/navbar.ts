import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { Login } from '../../../../auth/login/login';              // modal standalone
import { AuthService } from '../../../../service/auth';            // ajusta si tu ruta difiere
import { CarritoService } from '../../../../service/carrito';      // ajusta si tu ruta difiere

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, Login],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  showLoginModal = false;

  private sub?: Subscription;

  constructor(
    public auth: AuthService,
    public cart: CarritoService
  ) {}

  ngOnInit(): void {
    // cuando cambia el estado de login, carga/limpia el carrito
    this.sub = this.auth.isLoggedIn$.subscribe(isIn => {
      if (isIn) {
        this.cart.cargarMiCarrito().subscribe();  // ← corregido (antes: loa())
      } else {
        this.cart.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    this.auth.logoutAllServerSide().subscribe(() => {
      this.cart.reset(); // asegurar limpieza
    });
  }
}
