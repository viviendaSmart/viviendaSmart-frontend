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
import {
  SimulationRequest,
  CostItem,
  CostType,
  CostCalcMode
} from '../../models/simulation-request';
import {AuthService} from '../../../../shared/services/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClassicButtonComponent} from '../../../../shared/components/classic-button/classic-button.component';
import {getAnalyticsUserId} from '@angular/cli/src/analytics/analytics'; // ajusta la ruta según tu proyecto

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
    {
      label: 'Costos Notariales (S/)',
      type: CostType.INITIAL,
      code: 'NOTARIAL',
      calcMode: CostCalcMode.FIXED_AMOUNT,
      periodNumber: null
    },
    {
      label: 'Costos Registrales (S/)',
      type: CostType.INITIAL,
      code: 'REGISTRAL',
      calcMode: CostCalcMode.FIXED_AMOUNT,
      periodNumber: null
    },
    {
      label: 'Comisión Estudio (%)',
      type: CostType.INITIAL,
      code: 'COMISION_ESTUDIO',
      calcMode: CostCalcMode.PERCENTAGE,   // 🔹 porcentaje sobre saldo a financiar
      periodNumber: null
    },
    {
      label: 'Comisión Activación (%)',
      type: CostType.INITIAL,
      code: 'COMISION_ACTIVACION',
      calcMode: CostCalcMode.PERCENTAGE,   // 🔹 porcentaje sobre saldo a financiar
      periodNumber: null
    }
  ];

  periodicCostDefinitions = [
    {
      label: 'Comisión Periódica (%)',
      type: CostType.PERIODIC,
      code: 'COMISION_PERIODICA',
      calcMode: CostCalcMode.PERCENTAGE, // monto fijo mensual
      periodNumber: null
    },
    {
      label: 'Portes (S/)',
      type: CostType.PERIODIC,
      code: 'PORTES',
      calcMode: CostCalcMode.FIXED_AMOUNT,
      periodNumber: null
    },
    {
      label: 'Gasto Administración (S/)',
      type: CostType.PERIODIC,
      code: 'GASTOS_ADMIN',
      calcMode: CostCalcMode.FIXED_AMOUNT,
      periodNumber: null
    },
    {
      label: 'Seguro Desgravamen (%)',
      type: CostType.PERIODIC,
      code: 'SEGURO_DESGRAVAMEN',
      calcMode: CostCalcMode.PERCENTAGE,   // si luego lo quieres como % del saldo
      periodNumber: null
    },
    {
      label: 'Seguro de Reisgo (%)',
      type: CostType.PERIODIC,
      code: 'SEGURO_RIESGO',
      calcMode: CostCalcMode.PERCENTAGE,   // si luego lo quieres como % del saldo
      periodNumber: null
    }
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
      bono: ['' as BonoType],
      rateType: ['', Validators.required],
      rate: [null, [Validators.required, Validators.min(0)]],
      plazo: [null, [Validators.required, Validators.min(1)]],
      termtype: ['', Validators.required],
      term: [null, [Validators.required, Validators.min(0)]],
      exchange: ['', Validators.required],
      initialPayment: [null, [Validators.required, Validators.min(0)]],
      frequency: [30, [Validators.required, Validators.min(1)]],

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
    const size          = this._selectedProperty?.size;         // número
    const price         = this._selectedProperty?.price;        // número

    if (this._selectedClient == null || this._selectedProperty == null) {
      return;
    }

    const dni = this._selectedClient.dni;

    // 1) Filtros duros: historial y apoyo previo
    if (credithistory === false) {
      this.showError(
        `El usuario con DNI ${dni} no califica a ningún bono por historial crediticio negativo`
      );
      this.availableBonos = allowed;
      this.ensureCurrentBonoIsValid(allowed);
      return;
    }

    if (support === true) {
      this.showError(
        `El usuario con DNI ${dni} no califica a ningún bono por haber recibido otro bono/ayuda habitacional`
      );
      this.availableBonos = allowed;
      this.ensureCurrentBonoIsValid(allowed);
      return;
    }

    // Validación básica de datos necesarios
    if (monthlyIncome == null || size == null || price == null) {
      this.showError(
        `No se puede evaluar los bonos para el usuario con DNI ${dni} porque faltan datos (ingreso, área o precio de la vivienda).`
      );
      this.availableBonos = allowed;
      this.ensureCurrentBonoIsValid(allowed);
      return;
    }

    // ======================
    // CASO BONO AVN (Techo Propio - Comprar)
    // ======================
    //
    // Backend asume que si llega "AVN" ya se validó:
    // - monthlyIncome <= 3715
    // - size <= 140
    // Opcionalmente puedes verificar que el precio no exceda el tope máximo usado en Techo Propio (136000).
    //

    const maxTechoPropioPrice = 136000;

    if (size > 140) {
      this.showError(
        `El usuario con DNI ${dni} no califica al bono AVN porque la vivienda tiene un área mayor a 140 m²`
      );
    } else if (monthlyIncome > 3715) {
      this.showError(
        `El usuario con DNI ${dni} no califica al bono AVN por tener un ingreso mensual superior a S/ 3,715`
      );
    } else if (price > maxTechoPropioPrice) {
      // Alineado con el último else del backend: "Precio fuera del rango definido de Techo Propio"
      this.showError(
        `El usuario con DNI ${dni} no califica al bono AVN porque la vivienda tiene un precio mayor a S/ ${maxTechoPropioPrice}, fuera del rango de Techo Propio`
      );
    } else {
      // Pasa todas las validaciones mínimas → el backend se encarga de
      // calcular el monto (46545, 56710, etc.) según price y size.
      allowed.add('AVN');
    }

    // ======================
    // CASO BONO CSP o MV
    // ======================
    if (monthlyIncome <= 2706) {
      allowed.add('MV');
      allowed.add('CSP');
    } else {
      this.showError(
        `El usuario con DNI ${dni} no califica a los bonos MV y CSP por tener un ingreso superior a S/ 2,706`
      );
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

  private buildCostsArray(): CostItem[] {
    const costs: CostItem[] = [];

    // Costos iniciales
    this.initialCostsArray.controls.forEach((ctrl, index) => {
      const amount = ctrl.value;
      if (!amount || amount <= 0) return; // si es 0 o vacío no lo mandamos

      const def = this.initialCostDefinitions[index];

      costs.push(new CostItem({
        type: def.type,                   // CostType.INITIAL
        code: def.code,                   // "NOTARIAL", "COMISION_ESTUDIO", etc.
        calcMode: def.calcMode,           // FIXED_AMOUNT o PERCENTAGE
        amount: amount,                   // número (S/ o %)
        periodNumber: def.periodNumber    // null en tu caso
      }));
    });

    // Costos periódicos
    this.periodicCostsArray.controls.forEach((ctrl, index) => {
      const amount = ctrl.value;
      if (!amount || amount <= 0) return;

      const def = this.periodicCostDefinitions[index];

      costs.push(new CostItem({
        type: def.type,                   // CostType.PERIODIC
        code: def.code,                   // "COMISION_PERIODICA", "PORTES", etc.
        calcMode: def.calcMode,
        amount: amount,
        periodNumber: def.periodNumber
      }));
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
     const user = this.authService.getUser();

    const request = new SimulationRequest({
      clientId: this._selectedClient.id!,
      propertyId: this._selectedProperty.id!,
      userId: user.id,

      initialPayment: v.initialPayment,
      termYears: v.plazo,
      frequency: v.frequency,

      cokRate: v.cokRate ? Number(v.cokRate) : 0,
      cokRateType: v.cokRateType ? String(v.cokRateType) : '',

      bonusType: bonusType,
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
