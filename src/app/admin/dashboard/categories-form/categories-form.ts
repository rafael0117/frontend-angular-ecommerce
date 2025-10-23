// src/app/admin/categories-form/categories-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

import { CategoriaService } from '../../../service/categoria';
import { Categoria } from '../../../interface/categoria';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categories-form.html'
})
export class CategoriesForm implements OnInit {
  isEdit = false;

  // id como number (opcional), nombre y estado alineados con el back
  categoria: Categoria = { id: undefined, nombre: '', estado: true };

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');   // string | null
    const id = idParam !== null ? Number(idParam) : null;      // number | null

    if (id !== null && !Number.isNaN(id)) {
      this.isEdit = true;
      this.categoriaService.getCategoriaById(id).subscribe({
        next: (cat) => this.categoria = { ...cat },            // cat.id es number
        error: (err) => console.error('Error cargando categoría', err),
      });
    }
  }

  saveCategory(): void {
    // En template-driven, el payload es el propio this.categoria
    const payload: Categoria = { ...this.categoria };

    if (this.isEdit && this.categoria.id != null) {
      this.categoriaService
        .updateCategoria(this.categoria.id, payload)           // id: number
        .subscribe({
          next: () => this.router.navigate(['/categories']),
          error: (e) => console.error('Error actualizando', e)
        });
    } else {
      this.categoriaService
        .addCategoria(payload)
        .subscribe({
          next: () => this.router.navigate(['/categories']),
          error: (e) => console.error('Error creando', e)
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
