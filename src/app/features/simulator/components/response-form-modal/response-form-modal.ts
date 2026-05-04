import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-response-form-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response-form-modal.html',
  styleUrl: './response-form-modal.css'
})
export class ResponseFormModal {

  // Podrías tiparlo como SimulationResult si ya tienes la interfaz en el frontend
  @Input() simulationResult: any | null = null;

}
