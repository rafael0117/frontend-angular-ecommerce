import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../service/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  @Input() isOpen = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() requestRegister = new EventEmitter<void>();

  username = '';
  password = '';
  loading = false;

  constructor(private router: Router, private authService: AuthService, private toast: ToastrService) {}

  @HostListener('document:keydown.escape') onEsc() { if (this.isOpen) this.close(); }

  private lockScroll(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  ngOnChanges() { this.lockScroll(this.isOpen);
     
   }
  ngOnDestroy() { this.lockScroll(false); 
    
  }

  close() { this.isOpen = false; this.isOpenChange.emit(false); this.lockScroll(false); }

switchToRegister(evt?: Event) {
  evt?.preventDefault();
  this.close();
  this.router.navigate([], { queryParams: { view: 'register' }, queryParamsHandling: 'merge' });
  this.requestRegister.emit();
}


  login(form: NgForm) {
    if (form.invalid) { this.toast.warning('Ingresa usuario y contraseña'); return; }
    if (this.loading) return;
    this.loading = true;

    this.authService.login({ username: this.username.trim(), password: this.password }).subscribe({
      next: (res) => {
        const roles: string[] = Array.isArray(res?.roles) ? res.roles : (typeof res?.roles === 'string' ? [res.roles] : []);
        if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPER')) this.router.navigate(['/admin/dashboard']);
        else this.router.navigate(['/']);
        this.toast.success('Sesión iniciada');
        this.close();
      },
      error: () => this.toast.error('Credenciales incorrectas o error del servidor'),
      complete: () => (this.loading = false),
    });
  }
}
