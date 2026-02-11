import { FenabanCalculator } from "./FenabanCalculator.ts";

// PPRS - Programa Proprio de Resultados Santander (ACT 2025/2026)
// Valor fixo igual para todos os empregados, baseado no ROAE
const PPRS_DEFAULT = 3880.84;

export class SantanderCalculator extends FenabanCalculator {
  readonly valorPPRS: number;

  constructor(valorPPRS?: number) {
    super(true); // majoracao habilitada (banco lucrativo)
    this.valorPPRS = valorPPRS ?? PPRS_DEFAULT;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: this.valorPPRS, name: "PPRS (Programa Proprio de Resultados)" };
  }
}
