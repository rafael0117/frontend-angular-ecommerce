import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../interface/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8181/api/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
  addProducto(producto:Producto): Observable<Producto>{
    return this.http.post<Producto>(this.apiUrl,producto);
  }
  updateProducto(id:number,producto:Producto){
    return this.http.put<Producto>(`${this.apiUrl}/${id}`,producto)
  }
  deleteProducto(id:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
