export enum CostType {
  INITIAL = 'INITIAL',
  PERIODIC = 'PERIODIC'
}

// Debe ir en el mismo archivo o importarse donde corresponda
export enum CostCalcMode {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  PERCENTAGE = 'PERCENTAGE'
}

export class CostItem {
  type!: CostType;             // INITIAL o PERIODIC
  code!: string;               // "NOTARIAL", "REGISTRAL", "DESGRAVAMEN", etc.
  calcMode!: CostCalcMode;     // FIXED_AMOUNT o PERCENTAGE
  amount!: number;             // BigDecimal -> number (soles o % según calcMode)
  periodNumber?: number | null;       // undefined = aplica a todos los periodos (PERIODIC)

  constructor(cost: {
    type: CostType;
    code: string;
    calcMode: CostCalcMode;
    amount: number;
    periodNumber?: number | null;
  }) {
    this.type = cost.type;
    this.code = cost.code ?? '';
    this.calcMode = cost.calcMode;
    this.amount = cost.amount ?? 0;
    this.periodNumber = cost.periodNumber;

  }
}

export class SimulationRequest {

  // IDs básicos
  clientId!: number;
  propertyId!: number;

  // Parámetros del crédito
  initialPayment!: number;   // cuota inicial en %
  termYears!: number;       // plazo de pago en meses
  frequency!: number;       // Frecuencia de pago
  rate!: number;             // valor de la tasa del préstamo
  rateType!: string;         // "TEA", "TNA", etc.
  exchange!: string;         // "PEN", "USD", etc.
  graceType?: string | null;
  term?: string | null;      // días de gracia en texto
  bonusType?: string | null; // "AVN", "CSP", "MV" o null

  // COK (tasa de descuento)
  cokRate!: number;          // valor de la tasa COK
  cokRateType!: string;      // "TEA", "TNA", etc. (mismo esquema que rateType)

  // Lista de costos
  costs: CostItem[] = [];

  constructor(sim: {
    clientId: number;
    propertyId: number;

    initialPayment: number;
    termYears: number;
    frequency: number;
    rate: number;
    rateType: string;
    exchange: string;
    graceType?: string | null;
    term?: string | null;
    bonusType?: string | null;

    cokRate: number;
    cokRateType: string;

    costs?: CostItem[];
  }) {
    this.clientId = sim.clientId;
    this.propertyId = sim.propertyId;

    this.initialPayment = sim.initialPayment ?? 0;
    this.termYears = sim.termYears ?? 0;
    this.frequency = sim.frequency ?? 0;
    this.rate = sim.rate ?? 0;
    this.rateType = sim.rateType ?? '';
    this.exchange = sim.exchange ?? '';

    this.graceType = sim.graceType ?? null;
    this.term = sim.term ?? null;
    this.bonusType = sim.bonusType ?? null;

    this.cokRate = sim.cokRate ?? 0;
    this.cokRateType = sim.cokRateType ?? '';

    this.costs = sim.costs ?? [];
  }
}
