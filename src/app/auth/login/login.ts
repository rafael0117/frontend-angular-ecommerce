import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth'; // ajusta la ruta si tu servicio está en otro folder
import { Login as LoginRequest } from '../../interface/login'; // tu interface { username, password }
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  username = '';
  password = '';
  loading = false;

  constructor(private router: Router, private authService: AuthService,private toast: ToastrService) {}

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  login() {
  if (!this.username || !this.password) {
    this.toast.warning('Ingresa usuario y contraseña');
    return;
  }

  this.authService.login({ username: this.username, password: this.password }).subscribe({
    next: (res) => {
      const roles = res.roles || [];
      if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPER')) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
      this.toast.success('Sesión iniciada'); // 👈
      this.close();
    },
    error: () => this.toast.error('Credenciales incorrectas o error del servidor'),
  });
}
}
