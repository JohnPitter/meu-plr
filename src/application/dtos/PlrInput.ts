import type { BankId } from "../../domain/value-objects/Bank.ts";
import type { Parcela } from "../../domain/entities/PlrCalculation.ts";

export interface PlrInput {
  bankId: BankId;
  salario: number;
  mesesTrabalhados: number;
  incluirContribuicaoSindical: boolean;
  parcela: Parcela;
}
