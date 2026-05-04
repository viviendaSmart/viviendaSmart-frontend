import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseFormModal } from '../response-form-modal/response-form-modal';

@Component({
  selector: 'app-simulation-log-item',
  standalone: true,
  imports: [CommonModule, ResponseFormModal],
  templateUrl: './simulation-log-item.component.html',
  styleUrl: './simulation-log-item.component.css'
})
export class SimulationLogItemComponent {
  @Input() simulation!: any;
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
