
export enum CostType {
  INITIAL = 'INITIAL',
  PERIODIC = 'PERIODIC'
}

export class CostItem {
  type!: CostType;       // INITIAL o PERIODIC
  amount!: number;       // BigDecimal -> number
  periodNumber?: number; // puede ser undefined

  constructor(cost: {
    type: CostType;
    amount: number;
    periodNumber?: number;
  }) {
    this.type = cost.type;
    this.amount = cost.amount ?? 0;
    this.periodNumber = cost.periodNumber;
  }
}


export class SimulationRequest {

  // IDs básicos
  clientId!: number;
  propertyId!: number;
  bonusId?: number | null;

  // Parámetros del crédito
  initialPayment!: number;  // cuota inicial en %
  termMonths!: number;      // plazo de pago en meses
  rate!: number;            // valor de la tasa
  rateType!: string;        // "TEA", "TNA", etc.
  exchange!: string;        // "PEN", "USD", etc.
  graceType?: string | null;
  term?: string | null;     // días de gracia en texto
  bonusType?: string | null; // "AVN", "CSP", "MV" o null

  // Lista de costos
  costs: CostItem[] = [];

  constructor(sim: {
    clientId: number;
    propertyId: number;
    bonusId?: number | null;

    initialPayment: number;
    termMonths: number;
    rate: number;
    rateType: string;
    exchange: string;
    graceType?: string | null;
    term?: string | null;
    bonusType?: string | null;

    costs?: CostItem[];
  }) {
    this.clientId = sim.clientId;
    this.propertyId = sim.propertyId;
    this.bonusId = sim.bonusId ?? null;

    this.initialPayment = sim.initialPayment ?? 0;
    this.termMonths = sim.termMonths ?? 0;
    this.rate = sim.rate ?? 0;
    this.rateType = sim.rateType ?? '';
    this.exchange = sim.exchange ?? '';

    this.graceType = sim.graceType ?? null;
    this.term = sim.term ?? null;
    this.bonusType = sim.bonusType ?? null;

    this.costs = sim.costs ?? [];
  }
}

