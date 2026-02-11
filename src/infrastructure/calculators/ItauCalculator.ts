import { FenabanCalculator } from "./FenabanCalculator.ts";

// PCR - Programa Complementar de Resultados (ACT 2025/2026)
// Valores por faixa de ROE, reajuste 6,25% (INPC mar/25 5,25% + 1%)
// 1o patamar (ROE <= 22,1%): R$ 3.908,05
// 2o patamar (ROE >  22,1%): R$ 4.096,42
// Exportados para referencia nos hints do formulario
export const PCR_1O_PATAMAR = 3908.05;
export const PCR_2O_PATAMAR = 4096.42;

export class ItauCalculator extends FenabanCalculator {
  readonly valorPCR: number;

  constructor(valorPCR?: number) {
    super(true); // majoracao habilitada (banco lucrativo)
    this.valorPCR = valorPCR ?? PCR_2O_PATAMAR;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: this.valorPCR, name: "PCR (Programa Complementar de Resultados)" };
  }
}
