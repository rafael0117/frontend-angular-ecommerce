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
  form: Categoria = { id: 0, nombre: '', estado: true };

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
    this.form = { id: 0, nombre: '', estado: true };
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
  const nombre = this.form.nombre?.trim();
  if (!nombre) {
    alert('La descripción es obligatoria');
    return;
  }

  // normaliza el payload
  const payload: Categoria = {
    id: this.form.id ?? undefined,           // mantiene undefined si no hay id
    nombre,
    estado: this.form.estado ?? true
  };

  if (this.isEdit) {
    // --- actualizar ---
    const id = Number(this.form.id);
    if (Number.isNaN(id)) {
      console.error('ID inválido para actualizar');
      return;
    }

    this.categoriaService.updateCategoria(id, payload).subscribe({
      next: () => {
        this.closeModal();
        this.listarCategorias();
      },
      error: (e) => console.error('Error actualizando categoría', e)
    });

  } else {
    // --- crear ---
    const { id, ...createPayload } = payload; // no enviar id en create
    this.categoriaService.addCategoria(createPayload).subscribe({
      next: () => {
        this.closeModal();
        this.listarCategorias();
      },
      error: (e) => console.error('Error creando categoría', e)
    });
  }
}


toggle(cat: Categoria): void {
  if (cat.id == null) {                      // id?: number
    console.error('La categoría no tiene id');
    return;
  }

  const nuevoEstado = !cat.estado;

  this.categoriaService.toggleEstado(cat.id, nuevoEstado).subscribe({
    next: (updated) => {
      cat.estado = updated.estado;           // refresca estado en la UI
    },
    error: (err) => console.error('Error al actualizar estado:', err),
  });
}


  // Cerrar modal al presionar ESC
  onEsc(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.closeModal();
  }
}
