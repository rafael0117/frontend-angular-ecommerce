import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth';
import { Router } from '@angular/router';
import { Registrar } from '../../interface/registrar';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() requestLogin = new EventEmitter<void>();

  email = '';
  username = '';
  password = '';
  showPassword = false;
  adminRequest = false;
  loading = false;

  constructor(private auth: AuthService, private router: Router, private toast: ToastrService) {}

  @HostListener('document:keydown.escape') onEsc() { if (this.isOpen) this.close(); }

  private lockScroll(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }
  ngOnChanges() { this.lockScroll(this.isOpen); }
  ngOnDestroy() { this.lockScroll(false); }

  close() { this.isOpen = false; this.isOpenChange.emit(false); this.lockScroll(false); }
  togglePassword() { this.showPassword = !this.showPassword; }

  switchToLogin() {
    this.close();
    this.router.navigate([], { queryParams: { view: 'login' }, queryParamsHandling: 'merge' });
    this.requestLogin.emit();
  }

  submit(form: NgForm) {
    if (form.invalid) {
      this.toast.warning('Completa todos los campos');
      return;
    }
    if (this.loading) return;
    this.loading = true;

    const payload: Registrar = {
      email: this.email.trim(),
      username: this.username.trim(),
      password: this.password,
      // adminRequest: this.adminRequest
    };

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.toast.success(res?.message || 'Usuario registrado');
        this.switchToLogin();
      },
      error: (err) => {
        const msg = err?.error?.message || 'No se pudo registrar';
        this.toast.error(msg);
      },
      complete: () => (this.loading = false),
    });
  }
}
