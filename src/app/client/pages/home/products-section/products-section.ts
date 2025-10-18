import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../../service/producto';
import { Producto } from '../../../../interface/producto';

@Component({
  selector: 'app-products-section',
  imports: [CommonModule],
  templateUrl: './products-section.html',
  styleUrl: './products-section.css'
})
export class ProductsSection  implements OnInit {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }
}