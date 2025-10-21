import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../interface/categoria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8181/api/categorias';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }
  
  addCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }
  updateCategoria(id: number, categoria: Categoria) {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }
  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cambiar el estado activo/inactivo
  toggleCategoria(id: number, nuevoEstado: boolean): Observable<Categoria> {
      return this.http.put<Categoria>(`${this.apiUrl}/${id}`, { estado: nuevoEstado });
  }

  toggleEstado(id: number, estado: boolean): Observable<Categoria> {
  return this.http.put<Categoria>(`${this.apiUrl}/${id}/estado?estado=${estado}`, {});
  }

  
}
