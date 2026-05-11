export interface SimulationResponse {
  id?: number;
  createdAt?: string; // Date or string depending on what backend sends
  userId: number;
  clientId: number;
  clientDni?: string; // We'll map this from backend or fetch it
  propertyId: number;
  propertyAddress?: string; // Map this from backend or fetch
  currency: string;
  loanAmount: number;
  financedBalance: number;
  bonusAmount: number;
  monthlyRate: number;
  periodRate?: number;
  installmentsPerYear: number;
  totalTerm: number;
  lifeInsuranceRatePeriod: number;
  riskInsuranceRatePeriod: number;
  totalInterest: number;
  totalAmountPaid: number;
  totalPrincipalAmortization: number;
  totalLifeInsurance: number;
  totalRiskInsurance: number;
  totalPeriodicCommissions: number;
  totalPortes: number;
  totalPeriodicCosts: number;
  discountRatePeriod: number;
  van: number;
  tir: number;
  tcea: number;
  schedule: AmortizationRow[];
}

export interface AmortizationRow {
  period: number;
  graceFlag: string;
  beginningBalance: number;
  interest: number;
  principal: number;
  installment: number;
  lifeInsurance: number;
  riskInsurance: number;
  periodicCommission: number;
  periodicCosts: number;
  endingBalance: number;
  cashFlow: number;
}
