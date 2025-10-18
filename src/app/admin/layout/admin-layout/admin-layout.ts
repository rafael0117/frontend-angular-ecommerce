import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar'; 

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar,NgClass],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {
  // Si algún día quieres controlar el colapso desde aquí,
  // puedes hacerlo con un @Input() hacia Sidebar.
}
