export enum CostType {
  INITIAL = 'INITIAL',
  PERIODIC = 'PERIODIC'
}

export enum CostCalcMode {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  PERCENTAGE = 'PERCENTAGE'
}

export class CostItem {
  type!: CostType;              // INITIAL o PERIODIC
  code!: string;                // "NOTARIAL", "REGISTRAL", "SEGURO_DESGRAVAMEN", etc.
  calcMode!: CostCalcMode;      // FIXED_AMOUNT o PERCENTAGE
  amount!: number;              // S/ o % según calcMode
  periodNumber?: number | null; // null = aplica a todos los periodos (PERIODIC)

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
    this.periodNumber = cost.periodNumber ?? null;
  }
}

export class SimulationRequest {

  // IDs básicos
  clientId!: number;
  propertyId!: number;
  userId!: number;   // 🔹 NUEVO: para poder leer Config en el backend

  // Parámetros variables del crédito (lo que el usuario mueve)
  initialPayment!: number;   // % inicial (ej. 10 = 10%)
  termYears!: number;        // años de plazo
  frequency!: number;        // días entre cuotas (30, 60, 90, etc.)

  // COK (tasa de descuento)
  cokRate!: number;          // ej. 0.05 para 5%
  cokRateType!: string;      // "TEA", "TNA", etc.

  // Bono (opcional)
  bonusType?: string | null; // "AVN", "CSP", "MV" o null

  // Lista de costos configurados
  costs: CostItem[] = [];

  constructor(sim: {
    clientId: number;
    propertyId: number;
    userId: number;

    initialPayment: number;
    termYears: number;
    frequency: number;

    cokRate: number;
    cokRateType: string;

    bonusType?: string | null;
    costs?: CostItem[];
  }) {
    this.clientId = sim.clientId;
    this.propertyId = sim.propertyId;
    this.userId = sim.userId;

    this.initialPayment = sim.initialPayment ?? 0;
    this.termYears = sim.termYears ?? 0;
    this.frequency = sim.frequency ?? 0;

    this.cokRate = sim.cokRate ?? 0;
    this.cokRateType = sim.cokRateType ?? '';

    this.bonusType = sim.bonusType ?? null;
    this.costs = sim.costs ?? [];
  }
}
