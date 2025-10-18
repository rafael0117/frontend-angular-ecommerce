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

  // ⚠️ tu interfaz es: { id: string; descripcion: string; estado: boolean }
  category: Categoria = { id: '', nombre: '', estado: true };

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // string | null

    if (id) {
      this.isEdit = true;
      this.categoriaService.getCategoriaById(id).subscribe({
        next: (cat) => {
          // Asegura que cat cumple la interfaz
          this.category = { ...cat };
        },
        error: (err) => {
          console.error('Error cargando categoría', err);
          // opcional: navegar de vuelta o mostrar toast
        }
      });
    }
  }

  saveCategory(): void {
    if (!this.category.nombre?.trim()) {
      alert('La descripción es obligatoria');
      return;
    }

    if (this.isEdit) {
      this.categoriaService
        .updateCategoria(this.category.id, this.category)
        .subscribe(() => this.router.navigate(['/categories']));
    } else {
      // genera ID local si tu backend no lo genera
      if (!this.category.id) this.category.id = Date.now().toString();
      this.categoriaService
        .addCategoria(this.category)
        .subscribe(() => this.router.navigate(['/categories']));
    }
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
