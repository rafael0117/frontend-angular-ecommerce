import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../interface/categoria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8182/api/categorias';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  getCategoriaById(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }
  
  addCategoria(producto: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, producto);
  }
  updateCategoria(id: string, producto: Categoria) {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, producto);
  }
  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cambiar el estado activo/inactivo
  toggleCategoria(id: string, nuevoEstado: boolean): Observable<Categoria> {
      return this.http.put<Categoria>(`${this.apiUrl}/${id}`, { estado: nuevoEstado });
  }


  
}
