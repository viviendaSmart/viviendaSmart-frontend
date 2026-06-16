import { TranslateModule } from '@ngx-translate/core';
import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelExportService } from '../../../../shared/services/excel-export.service';

@Component({
  selector: 'app-response-form-modal',
  standalone: true,
  imports: [
    TranslateModule,CommonModule],
  templateUrl: './response-form-modal.html',
  styleUrl: './response-form-modal.css'
})
export class ResponseFormModal {

  // Podrías tiparlo como SimulationResult si ya tienes la interfaz en el frontend
  @Input() simulationResult: any | null = null;

  constructor(private excelExportService: ExcelExportService) {}

  exportToExcel() {
    if (this.simulationResult) {
      this.excelExportService.exportSimulation(this.simulationResult, 'Simulacion_Credito_Hipotecario');
    }
  }
}
