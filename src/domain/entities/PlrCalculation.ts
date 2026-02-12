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
  valorPrimeiraParcela: number | null;
  totalBruto: number;
  irrf: number;
  irrfPrimeiraParcela: number;
  contribuicaoSindical: number;
  totalLiquido: number;
  brutoSegundaParcela: number;
  irrfSegundaParcela: number;
  liquidoSegundaParcela: number;
  breakdown: PlrBreakdown;
}
