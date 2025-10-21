import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Login } from '../../../../auth/login/login'; // tu componente modal standalone
import { AuthService } from '../../../../service/auth';
import { ToastrService } from 'ngx-toastr';
// ajusta la ruta si difiere

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, Login],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  mobileMenuOpen = false;
  showLoginModal = false;

  constructor(public auth: AuthService,private toast: ToastrService) {}

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

 logout() {
  this.auth.logoutAllServerSide().subscribe(() => {
    this.toast.info('Sesión cerrada'); // <<<< AQUI
    // this.router.navigate(['/']);
  });
}
}
