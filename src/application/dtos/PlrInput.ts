import type { BankId } from "../../domain/value-objects/Bank.ts";

export interface PlrInput {
  bankId: BankId;
  salario: number;
  mesesTrabalhados: number;
  incluirContribuicaoSindical: boolean;
  valorProgramaBanco?: number;
}
