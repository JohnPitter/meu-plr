import { FenabanCalculator } from "./FenabanCalculator.ts";

// PCR - Programa Complementar de Resultados
// Valor base de referencia (multiplicado pelo fator de ROE anunciado pelo banco)
const PCR_VALOR_BASE = 1429.54;
const PCR_MULTIPLICADOR_DEFAULT = 2.2;

export class ItauCalculator extends FenabanCalculator {
  readonly multiplicador: number;

  constructor(multiplicador?: number) {
    super();
    this.multiplicador = multiplicador ?? PCR_MULTIPLICADOR_DEFAULT;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    const value = Math.round(PCR_VALOR_BASE * this.multiplicador * 100) / 100;
    return { value, name: `PCR (${this.multiplicador}x)` };
  }
}
