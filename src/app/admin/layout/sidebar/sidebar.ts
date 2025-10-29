import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgClass, CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth'; // ajusta la ruta si difiere

type MenuItem = { icon: string; label: string; path: string; exact?: boolean };

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgFor, NgClass],
  templateUrl: './sidebar.html'
})
export class Sidebar implements OnInit {
  @HostBinding('class')
  hostClass =
    'bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col transition-all duration-200';

  collapsed = false;
  brand = 'Fashion Store';

  // Rutas RELATIVAS al /admin (porque Sidebar vive bajo AdminLayout)
  menu: MenuItem[] = [
    { icon: '📊', label: 'Dashboard',  path: 'dashboard',  exact: true },
    { icon: '📦', label: 'Productos',  path: 'products' },
    { icon: '🏷️', label: 'Categorías', path: 'categories' },
    { icon: '📝', label: 'Pedidos',    path: 'pedidos' }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('sidebar:collapsed');
    this.collapsed = saved === '1';
  }

  toggle(): void {
    this.collapsed = !this.collapsed;
    localStorage.setItem('sidebar:collapsed', this.collapsed ? '1' : '0');
  }

  // 👉 Logout + navegar a la home pública
  logout(): void {
    this.auth.logoutAllServerSide().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/']) // por si el server falla, igual salimos
    });
  }
}
