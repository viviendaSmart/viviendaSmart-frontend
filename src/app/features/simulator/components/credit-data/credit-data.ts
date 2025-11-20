import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgForOf } from '@angular/common';
import { ConfigService } from '../../../config/services/config.service';
import { Property } from '../../../property/models/property.entity';
import {Client} from '../../../client/models/client.entity';
import {SimulationRequest} from '../../models/simulation-request';
import {AuthService} from '../../../../shared/services/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClassicButtonComponent} from '../../../../shared/components/classic-button/classic-button.component'; // ajusta la ruta según tu proyecto

// TIPOS DE BONOS
type BonoType = 'NONE' | 'AVN' | 'CSP' | 'MV';

interface BonoOption {
  label: string;
  value: BonoType;
}

@Component({
  selector: 'app-credit-data',
  imports: [ReactiveFormsModule, NgForOf, ClassicButtonComponent],
  templateUrl: './credit-data.html',
  styleUrl: './credit-data.css'
})
export class CreditData implements OnInit {
  form!: FormGroup;

  private _selectedProperty: Property | null = null;
  private _selectedClient: Client | null = null;

  @Output() plazoChange = new EventEmitter<number>();
  @Output() simulate = new EventEmitter<SimulationRequest>();
  @Output() clearSimulate = new EventEmitter<void>();

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

  initialCostDefinitions = [
    { label: 'Costos Notariales (S/)',  type: 'INITIAL',  periodNumber: null },
    { label: 'Costos Registrales (S/)', type: 'INITIAL',  periodNumber: null },
    { label: 'Comisión Estudio (%)',   type: 'INITIAL', periodNumber: null },
    { label: 'Comisión Activación (%)',type: 'INITIAL', periodNumber: null },
  ];

  periodicCostDefinitions = [
    { label: 'Comisión Periódica (S/)',    type: 'PERIODIC', periodNumber: null },
    { label: 'Portes (S/)',                type: 'PERIODIC', periodNumber: null },
    { label: 'Gasto Administración (S/)',  type: 'PERIODIC', periodNumber: null },
    { label: 'Seguro Desgravamen (%)',     type: 'PERIODIC', periodNumber: null },
  ];


  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadConfigAndPatchForm();
    if (this._selectedProperty) {
      this.form.get('price')?.setValue(this._selectedProperty.price, { emitEvent: true });
    }
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
      exchange: ['', Validators.required],
      initialPayment: [null, [Validators.required, Validators.min(0)]],

      initialCosts: this.fb.array(this.initialCostDefinitions.map(() => this.fb.control(0))),
      periodicCosts: this.fb.array(this.periodicCostDefinitions.map(() => this.fb.control(0))),

      cokRateType: ['', Validators.required],
      cokRate: [null, [Validators.required, Validators.min(0)]],
    });
  }

  get initialCostsArray(): FormArray {
    return this.form.get('initialCosts') as FormArray;
  }

  get periodicCostsArray(): FormArray {
    return this.form.get('periodicCosts') as FormArray;
  }

  private loadConfigAndPatchForm(): void {
    const user = this.authService.getUser();
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

  private updateAvailableBonos(): void {
    const allowed = new Set<BonoType>(['NONE']);

    const credithistory = this._selectedClient?.credithistory;  // boolean
    const support       = this._selectedClient?.support;        // boolean
    const monthlyIncome = this._selectedClient?.monthlyIncome;  // número
    const size          = this._selectedProperty?.size;        // número

    if(this._selectedClient == null || this._selectedProperty == null){
      return;
    }

    if (credithistory == false) {
      this.showError(`El usuario con DNI ${this._selectedClient?.dni} no califica a ningún bono por historial crediticio negativo`);
      this.availableBonos = allowed;
      this.ensureCurrentBonoIsValid(allowed);
      return;
    }

    if (support == true) {
      this.showError(`El usuario con DNI ${this._selectedClient?.dni} no califica a ningún bono por haber recibido otro bono/ayuda habitacional`);
      this.availableBonos = allowed;
      this.ensureCurrentBonoIsValid(allowed);
      return;
    }

    if (size && size< 140) {
      if (monthlyIncome && monthlyIncome<= 3715) {
        allowed.add('AVN');

      } else {
        this.showError(` El usuario con DNI ${this._selectedClient?.dni} no califica al bono AVN por tener un ingreso mensual superior a 3715 soles`);
      }
    } else{
      this.showError(` El usuario con DNI ${this._selectedClient?.dni} no califica al bono AVN por que la vivienda tiene un área mayor o igual a 140 m²`);
    }

    if (monthlyIncome && monthlyIncome <= 2706) {
      allowed.add('MV');
      allowed.add('CSP');
    } else{
      this.showError(` El usuario con DNI ${this._selectedClient?.dni} no califica a los bonos MV y CSP por tener un ingreso superior a 2706 soles`);
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

  private buildCostsArray(): any[] {
    const costs: any[] = [];

    this.initialCostsArray.controls.forEach((ctrl, index) => {
      const amount = ctrl.value;
      if (!amount || amount <= 0) return; // si es 0 o vacío no lo mandamos

      const def = this.initialCostDefinitions[index];

      costs.push({
        type: def.type,              // INITIAL o PERIODIC
        amount: amount,              // monto
        periodNumber: def.periodNumber // null en tu caso
      });
    });
    this.periodicCostsArray.controls.forEach((ctrl, index) => {
      const amount = ctrl.value;
      if (!amount || amount <= 0) return; // si es 0 o vacío no lo mandamos

      const def = this.periodicCostDefinitions[index];

      costs.push({
        type: def.type,              // INITIAL o PERIODIC
        amount: amount,              // monto
        periodNumber: def.periodNumber // null en tu caso
      });
    });
    return costs;
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

          clientId: this._selectedClient.id!,
          propertyId: this._selectedProperty.id!,

          initialPayment: v.initialPayment,
          termMonths: v.plazo,
          rate: v.rate,
          rateType: v.rateType,
          exchange: v.exchange,

          graceType: v.termtype,
          term: v.term ? String(v.term) : null,
          bonusType: v.bono,

          cokRate: v.cokRate ? Number(v.cokRate) : 0,
          cokRateType: v.cokRateType ? String(v.cokRateType) : '',
          costs: this.buildCostsArray()


    });

    this.simulate.emit(request);
  }

  cleanSimulate(){
    this.clearSimulate.emit();
  }

  private showError(message: string): void {
    this._snackBar.open(message, '', {duration: 5000});
  }
}
