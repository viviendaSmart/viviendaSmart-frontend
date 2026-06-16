import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  exportSimulation(sim: any, fileName: string): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // 1. Crear Hoja de Resumen (Resumen)
    const currencySymbol = sim.currency === 'DOLARES' ? '$' : 'S/';
    const periodRate = sim.monthlyRate != null ? sim.monthlyRate : sim.periodRate;

    const summaryData = [
      ['RESULTADO DE LA SIMULACIÓN DE CRÉDITO HIPOTECARIO'],
      [],
      ['Resumen del Crédito'],
      ['Saldo a financiar del activo (' + currencySymbol + ')', sim.financedBalance],
      ['Bono BFH (' + currencySymbol + ')', sim.bonusAmount],
      ['Monto del préstamo (' + currencySymbol + ')', sim.loanAmount],
      ['Tasa efectiva por periodo (%)', periodRate * 100],
      ['N° cuotas por año', sim.installmentsPerYear],
      ['N° total de cuotas', sim.totalTerm],
      [],
      ['Tasas de Seguros por Periodo'],
      ['Seguro Desgravamen (%)', sim.lifeInsuranceRatePeriod * 100],
      ['Seguro Riesgo (%)', sim.riskInsuranceRatePeriod * 100],
      [],
      ['Totales del Préstamo'],
      ['Intereses totales (' + currencySymbol + ')', sim.totalInterest],
      ['Total pagado en cuotas (' + currencySymbol + ')', sim.totalAmountPaid],
      ['Amortización total de capital (' + currencySymbol + ')', sim.totalPrincipalAmortization],
      [],
      ['Costos y Gastos'],
      ['Total seguro desgravamen (' + currencySymbol + ')', sim.totalLifeInsurance],
      ['Total seguro de riesgo (' + currencySymbol + ')', sim.totalRiskInsurance],
      ['Total comisiones periódicas (' + currencySymbol + ')', sim.totalPeriodicCommissions],
      ['Total portes (' + currencySymbol + ')', sim.totalPortes],
      ['Total costos periódicos (' + currencySymbol + ')', sim.totalPeriodicCosts],
      [],
      ['Indicadores Financieros'],
      ['Tasa descuento por periodo (%)', sim.discountRatePeriod * 100],
      ['VAN (' + currencySymbol + ')', sim.van],
      ['TIR mensual (%)', sim.tir * 100],
      ['TCEA (%)', sim.tcea * 100]
    ];

    const wsSummary: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Auto-ajustar ancho de la primera columna
    wsSummary['!cols'] = [{ wch: 45 }, { wch: 20 }];
    
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

    // 2. Crear Hoja de Cronograma (Cronograma)
    if (sim.schedule && sim.schedule.length > 0) {
      const scheduleData = sim.schedule.map((row: any) => ({
        'Periodo': row.period,
        'P.G.': row.graceFlag,
        'Saldo Inicial': row.beginningBalance,
        'Interés': row.interest,
        'Amortización': row.principal,
        'Cuota': row.installment,
        'Seguro Desgravamen': row.lifeInsurance,
        'Seguro Riesgo': row.riskInsurance,
        'Comisión Periódica': row.periodicCommission,
        'Costos Periódicos Fijos': row.periodicCosts,
        'Saldo Final': row.endingBalance,
        'Flujo': row.cashFlow
      }));

      const wsSchedule: XLSX.WorkSheet = XLSX.utils.json_to_sheet(scheduleData);
      XLSX.utils.book_append_sheet(wb, wsSchedule, 'Cronograma');
    }

    // 3. Escribir y descargar el archivo Excel
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
