import type { IPlrCalculator } from "../../domain/interfaces/IPlrCalculator.ts";
import { BANKS, type BankId } from "../../domain/value-objects/Bank.ts";
import { InvalidBankError } from "../../domain/errors/index.ts";
import { FenabanCalculator } from "./FenabanCalculator.ts";
import { ItauCalculator } from "./ItauCalculator.ts";
import { SantanderCalculator } from "./SantanderCalculator.ts";
import { BradescoCalculator } from "./BradescoCalculator.ts";
import { BbCalculator } from "./BbCalculator.ts";
import { CaixaCalculator } from "./CaixaCalculator.ts";

export interface CalculatorOptions {
  valorPrograma?: number;
}

export function createCalculator(bankId: BankId, options?: CalculatorOptions): IPlrCalculator {
  switch (bankId) {
    case BANKS.ITAU:
      return new ItauCalculator(options?.valorPrograma);
    case BANKS.SANTANDER:
      return new SantanderCalculator(options?.valorPrograma);
    case BANKS.BRADESCO:
      return new BradescoCalculator(options?.valorPrograma);
    case BANKS.BB:
      return new BbCalculator(options?.valorPrograma);
    case BANKS.CAIXA:
      return new CaixaCalculator(options?.valorPrograma);
    case BANKS.SAFRA:
      return new FenabanCalculator();
    default:
      throw new InvalidBankError(bankId);
  }
}
