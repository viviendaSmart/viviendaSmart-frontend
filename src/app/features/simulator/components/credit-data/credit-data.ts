import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgForOf } from '@angular/common';
import { ConfigService } from '../../../config/services/config.service';
import { Property } from '../../../property/models/property.entity';
import {Client} from '../../../client/models/client.entity';
import {SimulationRequest} from '../../models/simulation-request'; // ajusta la ruta según tu proyecto

// TIPOS DE BONOS
type BonoType = 'NONE' | 'AVN' | 'CSP' | 'MV';

interface BonoOption {
  label: string;
  value: BonoType;
}

@Component({
  selector: 'app-credit-data',
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './credit-data.html',
  styleUrl: './credit-data.css'
})
export class CreditData implements OnInit {
  form!: FormGroup;

  private _selectedProperty: Property | null = null;
  private _selectedClient: Client | null = null;

  @Output() plazoChange = new EventEmitter<number>();
  @Output() simulate = new EventEmitter<SimulationRequest>();

  @Input()
  set selectedProperty(value: Property | null) {
    this._selectedProperty = value;

    if (this.form && value) {
      this.form.get('price')?.setValue(value.price, { emitEvent: true });
      this.updateAvailableBonos();
    }
  }

  @Input()
  set selectedClient(value: Client | null) {
    this._selectedClient = value;

    if (this.form && value) {
      this.updateAvailableBonos();
    }
  }

  bonos: BonoOption[] = [
    { label: 'No aplica',       value: 'NONE' },
    { label: 'Comprar (AVN)',   value: 'AVN'  },
    { label: 'Construir (CSP)', value: 'CSP'  },
    { label: 'Mejorar (MV)',    value: 'MV'   }
  ];

  availableBonos = new Set<BonoType>(['NONE']);

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadConfigAndPatchForm();
    this.listenPlazoChanges();
    if (this._selectedProperty) {
      this.form.get('price')?.setValue(this._selectedProperty.price, { emitEvent: true });
    }
    this.form.valueChanges.subscribe(() => this.updateAvailableBonos());
    this.updateAvailableBonos();
  }

  // --------- Métodos privados --------- //

  private buildForm(): void {
    this.form = this.fb.group({
      price: [null, [Validators.required, Validators.min(0)]],
      bono: ['NONE' as BonoType],
      rateType: ['', Validators.required],
      rate: [null, [Validators.required, Validators.min(0)]],
      plazo: [null, [Validators.required, Validators.min(1)]],
      termtype: ['', Validators.required],
      term: [null, [Validators.required, Validators.min(0)]],
      exchange: ['', Validators.required]
    });
  }

  private loadConfigAndPatchForm(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    if (!userId) return;

    this.configService.getByUserId(userId).subscribe({
      next: (config: any) => {
        if (!config) return;

        this.form.patchValue({
          rateType:  config.rateType,
          rate:      config.rate,
          termtype:  config.termtype,
          term:      config.term,
          exchange:  config.exchange
        });
      },
      error: err => console.error('Error cargando config para simulador', err)
    });
  }

  private listenPlazoChanges(): void {
    this.form.get('plazo')?.valueChanges.subscribe((value: number) => {
      this.plazoChange.emit(value);
    });
  }

  private updateAvailableBonos(): void {
    const allowed = new Set<BonoType>(['NONE']);

    const credithistory = this.selectedClient?.credithistory;  // boolean
    const support       = this.selectedClient?.support;        // boolean
    const monthlyIncome = this.selectedClient?.monthlyIncome;  // número
    const size          = this._selectedProperty?.size;        // número

    // Validar historial / soporte
    if (!credithistory || !support) {
      console.info(`${this.selectedClient?.dni} no califica al bono por historial crediticio o requisitos de soporte.`);
      this.availableBonos = allowed;
      this.ensureCurrentBonoIsValid(allowed);
      return;
    }

    // Reglas de negocio (solo si pasó los filtros anteriores)
    if (monthlyIncome && monthlyIncome<= 3715 && size && size< 140) {
      allowed.add('AVN');
    }

    if (monthlyIncome && monthlyIncome <= 2706) {
      allowed.add('MV');
      allowed.add('CSP');
    }

    this.availableBonos = allowed;
    this.ensureCurrentBonoIsValid(allowed);
  }

  private ensureCurrentBonoIsValid(allowed: Set<BonoType>): void {
    const current = this.form.get('bono')?.value as BonoType;
    if (!allowed.has(current)) {
      this.form.get('bono')?.setValue('NONE', { emitEvent: false });
    }
  }

  onSimulate(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this._selectedClient || !this._selectedProperty) {
      console.warn('Falta seleccionar cliente y propiedad para simular');
      return;
    }

    const v = this.form.value;

    // mapear el bono a bonusType del backend
    const bono = v.bono as 'NONE' | 'AVN' | 'CSP' | 'MV';
    const bonusType = bono === 'NONE' ? null : bono;

    const request = new SimulationRequest({
      clientId: this._selectedClient.id!,          // asumiendo que id existe
      propertyId: this._selectedProperty.id!,      // idem
      bonusId: null,                               // por ahora

      initialPayment: 0,                           // luego lo puedes sacar del form
      termMonths: v.plazo,
      rate: v.rate,
      rateType: v.rateType,
      exchange: v.exchange,

      graceType: null,                             // por ahora
      term: v.term ? String(v.term) : null,        // días de gracia como string

      bonusType: bonusType,
      costs: []                                    // más adelante llenas costos
    });

    this.simulate.emit(request);
  }

}
