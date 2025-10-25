// pedido.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// pedido.types.ts
export interface DetallePedidoDTO {
  id: number;
  idProducto: number;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
  talla: string | null;
  color: string | null;
  totalLinea: number;
}

export interface PedidoDTO {
  id: number;
  idUsuario: number;
  fechaCreacion: string; // ISO
  estado: 'CREATED' | 'CONFIRMED' | 'CANCELLED' | string;
  subtotal: number;
  impuesto: number;   // IGV
  envio: number | null;
  descuento: number | null;
  total: number;
  direccionEnvio: string;
  metodoPago: string;
  detalles: DetallePedidoDTO[];
}

// adapters.ts
export interface DetalleCarritoView {
  id: number;
  idProducto: number;
  nombreProducto: string;
  precio: number;        // ← adaptado de precioUnitario
  cantidad: number;
  talla?: string | null;
  color?: string | null;
  subtotal: number;      // ← totalLinea
}

export const mapPedidoToCarritoView = (p: PedidoDTO): DetalleCarritoView[] =>
  p.detalles.map(d => ({
    id: d.id,
    idProducto: d.idProducto,
    nombreProducto: d.nombreProducto,
    precio: d.precioUnitario,
    cantidad: d.cantidad,
    talla: d.talla,
    color: d.color,
    subtotal: d.totalLinea,
  }));

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private baseUrl = 'http://localhost:8183/api/pedidos'; // ajusta tu gateway

  constructor(private http: HttpClient) {}

  crearPedido(input: { idUsuario: number; direccionEnvio: string; metodoPago: string; }): 
    Observable<{ pedido: PedidoDTO; detallesView: DetalleCarritoView[] }> {
    return this.http.post<PedidoDTO>(`${this.baseUrl}`, input).pipe(
      map(pedido => ({
        pedido,
        detallesView: mapPedidoToCarritoView(pedido),
      }))
    );
  }
}
