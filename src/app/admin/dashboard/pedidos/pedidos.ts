import { Component, OnInit } from '@angular/core';
import { PedidoDTO, PedidoService, PedidoAdminUpdateRequest } from '../../../service/pedido';
import { AuthService } from '../../../service/auth';
import { PedidosForm } from "../pedidos-form/pedidos-form";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css'],
  imports: [PedidosForm,CommonModule]
})
export class Pedidos implements OnInit {
  pedidos: PedidoDTO[] = [];
  loading = true;
  errorMessage = '';
  pedidoSeleccionado?: PedidoDTO; // Pedido para el modal

  constructor(private pedidoService: PedidoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    const token = this.authService.accessToken;
    if (!token) {
      this.errorMessage = 'No se encontró el token de autenticación.';
      this.loading = false;
      return;
    }

    this.pedidoService.listarPedidos(token).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener pedidos:', err);
        this.errorMessage = 'No se pudieron cargar los pedidos.';
        this.loading = false;
      },
    });
  }

  abrirModal(pedido: PedidoDTO) {
    this.pedidoSeleccionado = { ...pedido }; // clonamos para editar sin afectar la lista
  }

  cerrarModal() {
    this.pedidoSeleccionado = undefined;
  }

  onPedidoActualizado(updated: PedidoDTO) {
    console.log('Pedido actualizado recibido:', updated);
    const index = this.pedidos.findIndex(p => p.id === updated.id);
    if (index !== -1) this.pedidos[index] = updated;
  }

}
