import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { Login } from '../../../../auth/login/login';          // modal standalone
import { AuthService } from '../../../../service/auth';
import { CarritoService } from '../../../../service/carrito';

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

  // public para usarlos en la plantilla
  constructor(
    public auth: AuthService,
    public cart: CarritoService
  ) {}

  ngOnInit(): void {
    // Carga inicial si ya hay sesión al entrar
    if (this.auth.isAuthenticated()) {
      this.cart.cargarMiCarrito().subscribe();
    } else {
      this.cart.reset();
    }

    // Cuando cambia el estado de login, carga/limpia el carrito
    this.sub = this.auth.isLoggedIn$
      .pipe(distinctUntilChanged())
      .subscribe(isIn => {
        if (isIn) {
          this.cart.cargarMiCarrito().subscribe();
        } else {
          this.cart.reset();
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout(): void {
    this.auth.logoutAllServerSide().subscribe(() => {
      this.cart.reset();           // asegurar limpieza
      this.showLoginModal = false; // por si estaba abierto
      this.mobileMenuOpen = false; // cierra menú móvil
    });
  }
}
