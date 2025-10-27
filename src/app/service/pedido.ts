import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// ==== Tipos ====
export interface DetallePedidoDTO {
  id: number;
  idProducto: number;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
  tallas: string[];
  colores: string[];
  totalLinea: number;
}

export interface PedidoDTO {
  id: number;
  idUsuario: number;
  fechaCreacion: string;
  estado: 'PENDING' | 'CREATED' | 'CONFIRMED' | 'CANCELLED' | string;
  subtotal: number;
  impuesto: number;
  envio: number | null;
  descuento: number | null;
  total: number;
  direccionEnvio: string;
  metodoPago: string;
  detalles: DetallePedidoDTO[];
}

export interface DetalleCarritoView {
  id: number;
  idProducto: number;
  nombreProducto: string;
  precio: number;
  cantidad: number;
  tallas: string[];
  colores: string[];
  subtotal: number;
}

// ==== Adaptador ====
export const mapPedidoToCarritoView = (p: PedidoDTO): DetalleCarritoView[] =>
  p.detalles.map(d => ({
    id: d.id,
    idProducto: d.idProducto,
    nombreProducto: d.nombreProducto,
    precio: d.precioUnitario,
    cantidad: d.cantidad,
    tallas: d.tallas,
    colores: d.colores,
    subtotal: d.totalLinea,
  }));

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private baseUrl = 'http://localhost:8183/api/pedidos'; // Ajusta si usas gateway

  constructor(private http: HttpClient) {}

  crearPedido(input: { direccionEnvio: string; metodoPago: string }, token: string):
  Observable<{ pedido: PedidoDTO; detallesView: DetalleCarritoView[] }> {
  return this.http.post<PedidoDTO>(this.baseUrl, input, {
    headers: { Authorization: `Bearer ${token}` }
  }).pipe(
    map(pedido => ({
      pedido,
      detallesView: mapPedidoToCarritoView(pedido),
    }))
  );
}

  getEstadosPedido(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/estado-pedido`);
  }

  getMetodosPago(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/metodo-pago`);
  }
}
