export interface TaxResult {
  totalPlr: number;
  aliquota: number;
  deducao: number;
  irrf: number;
  faixa: string;
}

export interface ITaxCalculator {
  calculate(totalPlr: number): TaxResult;
}
