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
export class CarritoService {private apiUrl = 'http://localhost:8185/api/carrito';
  private _carrito$ = new BehaviorSubject<CarritoResponse | null>(null);
  carrito$ = this._carrito$.asObservable();
  private _count$ = new BehaviorSubject<number>(0);
  count$ = this._count$.asObservable();

  /** 🔹 Nuevo: carrito temporal para el proceso de pedido */
  private carritoTemporal: CarritoResponse | null = null;

  constructor(private http: HttpClient) {}

  cargarMiCarrito(): Observable<CarritoResponse> {
    return this.http.get<CarritoResponse>(`${this.apiUrl}`).pipe(
      tap((car) => this.asignarCarrito(car))
    );
  }

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

  vaciar(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vaciar`).pipe(
      tap(() => {
        const actual = this._carrito$.value;
        if (!actual) return;
        this.asignarCarrito({ ...actual, detalles: [] });
      })
    );
  }

  private asignarCarrito(car: CarritoResponse) {
    this._carrito$.next(car);
    const count = car.detalles?.reduce((acc, d) => acc + (d.cantidad ?? 0), 0) ?? 0;
    this._count$.next(count);
  }

  reset() {
    this._carrito$.next(null);
    this._count$.next(0);
  }

  /** 🔹 Nuevo: guardar carrito temporal */
  setCarritoTemporal(cart: CarritoResponse) {
    this.carritoTemporal = cart;
  }

  /** 🔹 Nuevo: obtener carrito temporal */
  getCarritoTemporal(): CarritoResponse | null {
    return this.carritoTemporal;
  }

  /** 🔹 Nuevo: limpiar carrito temporal después de confirmar */
  clearCarritoTemporal() {
    this.carritoTemporal = null;
  }
}
