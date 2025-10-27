import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { Login } from '../../../../auth/login/login';
import { Register } from '../../../../auth/register/register';
import { AuthService } from '../../../../service/auth';
import { CarritoService } from '../../../../service/carrito';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, Login, Register],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  showLoginModal = false;
  showRegisterModal = false;

  private sub?: Subscription;

  constructor(
    public auth: AuthService,
    public cart: CarritoService
  ) {}

  ngOnInit(): void {
    // Cargar carrito si ya hay sesión
    if (this.auth.isAuthenticated()) {
      this.cart.cargarMiCarrito().subscribe();
    } else {
      this.cart.reset();
    }

    // Escuchar cambios de login
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

  openLogin(): void {
    this.showRegisterModal = false;
    this.showLoginModal = true;
  }

  openRegister(): void {
    this.showLoginModal = false;
    this.showRegisterModal = true;
  }

  logout(): void {
    this.auth.logoutAllServerSide().subscribe(() => {
      this.cart.reset();
      this.showLoginModal = false;
      this.showRegisterModal = false;
      this.mobileMenuOpen = false;
    });
  }
}
