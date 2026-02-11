import { FenabanCalculator } from "./FenabanCalculator.ts";

// PRB - Programa de Remuneracao Bradesco (ACT 2025/2026)
// Valores por faixa de ROAE:
// ROAE minimo:  R$ 1.000
// ROAE 17%:     R$ 2.000
// ROAE 18,5%:   R$ 2.500
const PRB_DEFAULT = 2500.0;

export class BradescoCalculator extends FenabanCalculator {
  readonly valorPrograma: number;

  constructor(valorPrograma?: number) {
    super(true); // majoracao habilitada (banco lucrativo)
    this.valorPrograma = valorPrograma ?? PRB_DEFAULT;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: this.valorPrograma, name: "PRB (Programa de Remuneracao Bradesco)" };
  }
}
