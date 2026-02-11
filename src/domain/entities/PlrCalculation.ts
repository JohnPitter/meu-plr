import type { BankId } from "../value-objects/Bank.ts";

export interface PlrBreakdown {
  regraBasicaAntecipacao: number;
  parcelaAdicionalAntecipacao: number;
  totalAntecipacao: number;
  regraBasicaExercicio: number;
  parcelaAdicionalExercicio: number;
  totalExercicioSemDesconto: number;
  descontoAntecipacao: number;
  totalExercicio: number;
  programaComplementar: number;
  programaComplementarNome: string | null;
}

export interface PlrCalculation {
  bankId: BankId;
  bankName: string;
  salario: number;
  mesesTrabalhados: number;
  totalBruto: number;
  irrf: number;
  contribuicaoSindical: number;
  totalLiquido: number;
  breakdown: PlrBreakdown;
}
