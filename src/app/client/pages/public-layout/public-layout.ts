// src/app/public/layout/public-layout/public-layout.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../../client/pages/layout/navbar/navbar';
import { Footer } from '../../../client/pages/layout/footer/footer';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer],
  template: `
    <!-- src/app/public/layout/public-layout/public-layout.html -->
<div class="min-h-screen flex flex-col bg-neutral-50">
  <app-navbar></app-navbar>

  <!-- Contenido de páginas -->
  <main class="flex-1">
    <router-outlet></router-outlet>
  </main>

  <app-footer></app-footer>
</div>

  `,
})
export class PublicLayout {}
