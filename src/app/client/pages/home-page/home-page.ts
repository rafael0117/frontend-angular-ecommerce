import { Component } from '@angular/core';
import { OffersSection } from '../home/offers-section/offers-section';
import { ProductsSection } from '../home/products-section/products-section';
import { CommonModule } from '@angular/common';
import { HeroSection } from '../home/hero-section/hero-section';

@Component({
  selector: 'app-home-page',
   imports: [CommonModule, HeroSection, ProductsSection, OffersSection],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
