// src/app/service/carrito.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

// src/app/service/carrito.model.ts
export interface DetalleCarritoDto {
  idProducto: number;
  cantidad: number;
  talla?: string | null;
  color?: string | null;
}

export interface DetalleCarrito {
  id: number;
  idProducto: number;
  nombreProducto: string;
  precio: number;
  cantidad: number;
  talla?: string | null;
  color?: string | null;
}

export interface CarritoResponse {
  id: number;
  idUsuario: number;
  fechaCreacion: string; // ISO
  detalles: DetalleCarrito[];
}


@Injectable({ providedIn: 'root' })
export class CarritoService {
  private apiUrl = 'http://localhost:8185/api/carrito';

  /** Estado completo del carrito del backend */
  private _carrito$ = new BehaviorSubject<CarritoResponse | null>(null);
  carrito$ = this._carrito$.asObservable();

  /** Contador (suma de cantidades de todos los detalles) */
  private _count$ = new BehaviorSubject<number>(0);
  count$ = this._count$.asObservable();

  constructor(private http: HttpClient) {}

  /** GET /api/carrito — devuelve CarritoResponse */
  cargarMiCarrito(): Observable<CarritoResponse> {
    return this.http.get<CarritoResponse>(`${this.apiUrl}`).pipe(
      tap((car) => this.asignarCarrito(car))
    );
  }

  /** POST /api/carrito/agregar — body: { idProducto, cantidad, ... } */
  agregar(detalle: DetalleCarritoDto): Observable<CarritoResponse> {
    const body: DetalleCarritoDto = {
      idProducto: Number(detalle.idProducto),
      cantidad: Number(detalle.cantidad),
      talla: detalle.talla ?? null,
      color: detalle.color ?? null,
    };
    return this.http.post<CarritoResponse>(`${this.apiUrl}/agregar`, body).pipe(
      tap((car) => this.asignarCarrito(car))
    );
  }

  /** DELETE /api/carrito/eliminar/{productoId} — 204 No Content */
  eliminar(idProducto: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${idProducto}`).pipe(
      tap(() => {
        const actual = this._carrito$.value;
        if (!actual) return;
        const detalles = actual.detalles.filter(d => d.idProducto !== idProducto);
        this.asignarCarrito({ ...actual, detalles });
      })
    );
  }

  /** DELETE /api/carrito/vaciar — 204 No Content */
  vaciar(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vaciar`).pipe(
      tap(() => {
        const actual = this._carrito$.value;
        if (!actual) return;
        this.asignarCarrito({ ...actual, detalles: [] });
      })
    );
  }

  /** ===== Helpers ===== */
  private asignarCarrito(car: CarritoResponse) {
    this._carrito$.next(car);
    const count = car.detalles?.reduce((acc, d) => acc + (d.cantidad ?? 0), 0) ?? 0;
    this._count$.next(count);
  }

  reset() {
    this._carrito$.next(null);
    this._count$.next(0);
  }
}
