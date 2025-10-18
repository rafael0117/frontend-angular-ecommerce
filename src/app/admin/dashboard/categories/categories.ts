import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // para [(ngModel)]
import { CategoriaService } from '../../../service/categoria';
import { Categoria } from '../../../interface/categoria';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html'
})
export class Categories implements OnInit {
  categorias: Categoria[] = [];

  // Estado del modal
  showModal = false;
  isEdit = false;

  // Modelo del formulario dentro del modal
  form: Categoria = { id: '', descripcion: '', estado: true };

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (cats) => (this.categorias = cats),
      error: (e) => console.error('Error listando categorías', e)
    });
  }

  // Abrir modal para crear
  openNew(): void {
    this.isEdit = false;
    this.form = { id: '', descripcion: '', estado: true };
    this.showModal = true;
  }

  // Abrir modal para editar
  openEdit(cat: Categoria): void {
    this.isEdit = true;
    this.form = { ...cat }; // clonar para no mutar la fila hasta guardar
    this.showModal = true;
  }

  // Cerrar modal
  closeModal(): void {
    this.showModal = false;
  }

  // Guardar (crear/actualizar)
  save(): void {
    if (!this.form.descripcion?.trim()) {
      alert('La descripción es obligatoria');
      return;
    }

    if (this.isEdit) {
      // actualizar
      this.categoriaService.updateCategoria(this.form.id, this.form).subscribe({
        next: () => {
          this.closeModal();
          this.listarCategorias(); // refrescar tabla
        },
        error: (e) => console.error('Error actualizando categoría', e)
      });
    } else {
      // crear
      if (!this.form.id) this.form.id = Date.now().toString(); // si tu backend lo asigna, quita esto
      this.categoriaService.addCategoria(this.form).subscribe({
        next: () => {
          this.closeModal();
          this.listarCategorias();
        },
        error: (e) => console.error('Error creando categoría', e)
      });
    }
  }

toggle(cat: Categoria): void {
  const nuevoEstado = !cat.estado;

  this.categoriaService.toggleCategoria(cat.id, nuevoEstado).subscribe({
    next: (updated) => {
      // Actualizar el estado en el array local
      cat.estado = updated.estado;
    },
    error: (err) => console.error('Error al actualizar estado:', err)
  });
}


  // Cerrar modal al presionar ESC
  onEsc(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.closeModal();
  }
}
