import { FenabanCalculator } from "./FenabanCalculator.ts";

// PPRS - Programa Proprio de Resultados Santander
// Valor base de referencia (multiplicado pelo fator de ROAE anunciado pelo banco)
const PPRS_VALOR_BASE = 1188.18;
const PPRS_MULTIPLICADOR_DEFAULT = 2.2;

export class SantanderCalculator extends FenabanCalculator {
  readonly multiplicador: number;

  constructor(multiplicador?: number) {
    super();
    this.multiplicador = multiplicador ?? PPRS_MULTIPLICADOR_DEFAULT;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    const value = Math.round(PPRS_VALOR_BASE * this.multiplicador * 100) / 100;
    return { value, name: `PPRS (${this.multiplicador}x)` };
  }
}
