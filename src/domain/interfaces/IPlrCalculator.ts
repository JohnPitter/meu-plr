import type { PlrBreakdown } from "../entities/PlrCalculation.ts";

export interface IPlrCalculator {
  calculateAntecipacao(salario: number): { regraBasica: number; parcelaAdicional: number };
  calculateExercicio(salario: number): { regraBasica: number; parcelaAdicional: number };
  calculateProgramaComplementar(salario: number): { value: number; name: string | null };
  getBreakdown(salario: number, meses: number): PlrBreakdown;
}
