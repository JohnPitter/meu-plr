import { FenabanCalculator } from "./FenabanCalculator.ts";

// PCR - Programa Complementar de Resultados
// Valor medio baseado em ROE (varia de R$ 3.070,95 a R$ 3.219,00)
const PCR_VALOR_MEDIO = 3144.98;

export class ItauCalculator extends FenabanCalculator {
  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: PCR_VALOR_MEDIO, name: "PCR (Programa Complementar de Resultados)" };
  }
}
