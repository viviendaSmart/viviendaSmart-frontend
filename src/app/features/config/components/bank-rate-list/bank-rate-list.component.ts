import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BancoInfo {
  nombre: string;
  tasa: number | null;
  tipoTasa: string | null;
  logo: string;
}

@Component({
  selector: 'app-bank-rate-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-rate-list.component.html',
  styleUrl: './bank-rate-list.component.css'
})
export class BankRateListComponent {
  @Output() bankSelected = new EventEmitter<BancoInfo>();

  listaBancos: BancoInfo[] = [
    { nombre: 'Scotiabank', tasa: 8.20, tipoTasa: 'TEA', logo: '/assets/img/scottia-logo.png' },
    { nombre: 'BBVA', tasa: 8.30, tipoTasa: 'TEA', logo: '/assets/img/bbva-logo.jpg' },
    { nombre: 'BCP', tasa: 8.50, tipoTasa: 'TEA', logo: '/assets/img/bcp-logo.jpg' },
    { nombre: 'Interbank', tasa: 8.60, tipoTasa: 'TEA', logo: '/assets/img/interbank-logo.png' },
    { nombre: 'BanBif', tasa: 8.70, tipoTasa: 'TEA', logo: '/assets/img/banbif-logo.jpg' },
    { nombre: 'Personalizado', tasa: null, tipoTasa: null, logo: '' }
  ];

  selectedBankIndex: number | null = null;

  selectBank(banco: BancoInfo, index: number) {
    this.selectedBankIndex = index;
    this.bankSelected.emit(banco);
  }
}
