import { Component, OnInit } from '@angular/core';
import { DetalleCarritoView, PedidoDTO, PedidoService } from '../../../service/pedido';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth';

@Component({
  selector: 'app-pedido',
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './pedido.html',
  styleUrls: ['./pedido.css']
})
export class Pedido implements OnInit {
  pedido?: PedidoDTO;
  detalles: DetalleCarritoView[] = [];
  cargando = false;
  mensaje = '';
  direccionEnvio = '';
  metodoPago = ''; // se llenará dinámicamente
  metodosPago: string[] = []; // 👈 lista para el select

constructor(private pedidoService: PedidoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.pedidoService.getMetodosPago().subscribe({
      next: (data) => {
        this.metodosPago = data;
        if (data.length > 0) {
          this.metodoPago = data[0]; // valor por defecto
        }
      },
      error: (err) => console.error('Error cargando métodos de pago', err)
    });
  }

crearPedido() {
  if (!this.direccionEnvio.trim()) {
    this.mensaje = 'Por favor ingresa una dirección de envío.';
    return;
  }

  const token = this.authService.accessToken;
  if (!token) {
    this.mensaje = 'Debes iniciar sesión para crear un pedido.';
    return;
  }

  this.cargando = true;
  this.mensaje = '';

  const request = {
    direccionEnvio: this.direccionEnvio,
    metodoPago: this.metodoPago,
  };

  this.pedidoService.crearPedido(request, token).subscribe({
    next: ({ pedido, detallesView }) => {
      this.pedido = pedido;
      this.detalles = detallesView;
      this.mensaje = 'Pedido creado exitosamente ✅';
      this.cargando = false;
    },
    error: (err) => {
      console.error(err);
      this.mensaje = 'Error al crear el pedido ❌';
      this.cargando = false;
    }
  });
}

}
