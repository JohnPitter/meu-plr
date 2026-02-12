import type { ITaxCalculator, TaxResult } from "../../domain/interfaces/ITaxCalculator.ts";

interface TaxBracket {
  limit: number;
  rate: number;
  deduction: number;
  label: string;
}

// Tabela exclusiva de IRRF sobre PLR — Lei 14.663/2023 (vigencia 2024+)
const TAX_BRACKETS: TaxBracket[] = [
  { limit: 7640.80, rate: 0, deduction: 0, label: "Isento" },
  { limit: 9922.28, rate: 0.075, deduction: 573.06, label: "7,5%" },
  { limit: 13167.0, rate: 0.15, deduction: 1317.23, label: "15%" },
  { limit: 16380.38, rate: 0.225, deduction: 2304.76, label: "22,5%" },
  { limit: Infinity, rate: 0.275, deduction: 3123.78, label: "27,5%" },
];

export class IrrfCalculator implements ITaxCalculator {
  calculate(totalPlr: number): TaxResult {
    if (totalPlr <= 0) {
      return { totalPlr, aliquota: 0, deducao: 0, irrf: 0, faixa: "Isento" };
    }

    const bracket = TAX_BRACKETS.find((b) => totalPlr <= b.limit)!;

    if (bracket.rate === 0) {
      return { totalPlr, aliquota: 0, deducao: 0, irrf: 0, faixa: bracket.label };
    }

    const irrf = Math.round((totalPlr * bracket.rate - bracket.deduction) * 100) / 100;

    return {
      totalPlr,
      aliquota: bracket.rate,
      deducao: bracket.deduction,
      irrf: Math.max(0, irrf),
      faixa: bracket.label,
    };
  }
}
