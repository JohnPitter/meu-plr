import type { PlrBreakdown } from "../../domain/entities/PlrCalculation.ts";
import { FenabanCalculator } from "./FenabanCalculator.ts";

// Caixa: PLR Social (4% do lucro) + teto de 3 remuneracoes base
const PLR_SOCIAL_VALOR_ESTIMADO = 3200.0;
const TETO_MULTIPLICADOR = 3;

export class CaixaCalculator extends FenabanCalculator {
  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: PLR_SOCIAL_VALOR_ESTIMADO, name: "PLR Social (4% do lucro liquido)" };
  }

  override getBreakdown(salario: number, meses: number): PlrBreakdown {
    const breakdown = super.getBreakdown(salario, meses);

    // Teto de 3 remuneracoes base
    const teto = salario * TETO_MULTIPLICADOR;
    const totalSemTeto = breakdown.totalAntecipacao + breakdown.totalExercicio + breakdown.programaComplementar;

    if (totalSemTeto > teto) {
      const fator = teto / totalSemTeto;
      return {
        ...breakdown,
        totalAntecipacao: Math.round(breakdown.totalAntecipacao * fator * 100) / 100,
        totalExercicio: Math.round(breakdown.totalExercicio * fator * 100) / 100,
        programaComplementar: Math.round(breakdown.programaComplementar * fator * 100) / 100,
      };
    }

    return breakdown;
  }
}
