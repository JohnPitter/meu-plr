import { FenabanCalculator } from "./FenabanCalculator.ts";

// PPRS - Programa Proprio de Resultados Santander
// Valor medio baseado em ROAE (varia de R$ 2.316,00 a R$ 2.912,00)
const PPRS_VALOR_MEDIO = 2614.0;

export class SantanderCalculator extends FenabanCalculator {
  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: PPRS_VALOR_MEDIO, name: "PPRS (Programa Proprio de Resultados)" };
  }
}
