import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./client/pages/layout/navbar/navbar";
import { Footer } from "./client/pages/layout/footer/footer";
import { HeroSection } from "./client/pages/home/hero-section/hero-section";
import { ProductsSection } from "./client/pages/home/products-section/products-section";
import { OffersSection } from "./client/pages/home/offers-section/offers-section";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, HeroSection, ProductsSection, OffersSection],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tienda-ropa');
}
