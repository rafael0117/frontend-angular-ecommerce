import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgClass } from '@angular/common';

type MenuItem = { icon: string; label: string; path: string; exact?: boolean };

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgClass],
  templateUrl: './sidebar.html'
})
export class Sidebar implements OnInit {
  @HostBinding('class')
  hostClass =
    'bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col transition-all duration-200';

  collapsed = false;
  brand = 'Fashion Store';

  // RUTAS RELATIVAS (sin slash)
  menu: MenuItem[] = [
    { icon: '📊', label: 'Dashboard',  path: 'dashboard',  exact: true },
    { icon: '📦', label: 'Productos',  path: 'products' },
    { icon: '🏷️', label: 'Categorías', path: 'categories' }
  ];

  ngOnInit(): void {
    const saved = localStorage.getItem('sidebar:collapsed');
    this.collapsed = saved === '1';
  }

  toggle(): void {
    this.collapsed = !this.collapsed;
    localStorage.setItem('sidebar:collapsed', this.collapsed ? '1' : '0');
  }
}
