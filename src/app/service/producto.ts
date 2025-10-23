import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interface/producto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private API = 'http://localhost:8181/api'; // ajusta puerto si aplica

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API}/productos`);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API}/productos/${id}`);
  }

  addProducto(body: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.post<Producto>(`${this.API}/productos`, body);
  }

  updateProducto(id: number, body: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.put<Producto>(`${this.API}/productos/${id}`, body);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/productos/${id}`);
  }
}
