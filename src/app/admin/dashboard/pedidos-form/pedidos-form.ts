import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PedidoAdminUpdateRequest, PedidoDTO, PedidoService } from '../../../service/pedido';
import { AuthService } from '../../../service/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-pedidos-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pedidos-form.html',
  styleUrls: ['./pedidos-form.css']
})

export class PedidosForm {
@Input() pedido?: PedidoDTO;
  @Output() cerrado = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<PedidoDTO>();

  estadosPedido = ['PENDING', 'CREATED', 'CONFIRMED', 'CANCELLED'];
  cargando = false;
  mensajeError = '';

  constructor(private pedidoService: PedidoService, private auth: AuthService) {}

  cerrar() {
    this.cerrado.emit();
  }

  guardarCambios() {
    if (!this.pedido) return;
    const token = this.auth.accessToken;
    if (!token) {
      this.mensajeError = 'No se encontró token de autenticación.';
      return;
    }

    const data: PedidoAdminUpdateRequest = {
      estado: this.pedido.estado,
      envio: this.pedido.envio ?? 0,
      descuento: this.pedido.descuento ?? 0,
      mensaje: this.pedido.mensaje ?? ''
    };


    this.cargando = true;
    this.pedidoService.actualizarPedidoComoAdmin(this.pedido.id, data, token).subscribe({
      next: (updated) => {
        this.cargando = false;
        this.actualizado.emit(updated);
        this.cerrar();
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'Error al actualizar el pedido.';
        this.cargando = false;
      }
    });
  }
}
