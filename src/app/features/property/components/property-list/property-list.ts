import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import {CommonModule, NgForOf} from '@angular/common';
import {Property} from '../../models/property.entity';
import {ClassicButtonComponent} from '../../../../shared/components/classic-button/classic-button.component';

@Component({
  selector: 'app-property-list',
  imports: [
    MatCard,
    NgForOf,
    CommonModule,
    MatCardActions,
    ClassicButtonComponent,
  ],
  templateUrl: './property-list.html',
  styleUrl: './property-list.css'
})
export class PropertyList {
  @Input() properties: Array<Property> = [];
  constructor(private router: Router) {}
  defaultImages = [
    '/assets/img/house1.jpg',
    '/assets/img/house2.jpg',
    '/assets/img/house3.jpg',
    '/assets/img/house4.jpg'
  ];

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;

    img.onerror = null;

    const randomIndex = Math.floor(Math.random() * this.defaultImages.length);
    img.src = this.defaultImages[randomIndex];

    console.warn(`⚠️ Imagen no encontrada, Usando ${img.src}`);
  }
}
