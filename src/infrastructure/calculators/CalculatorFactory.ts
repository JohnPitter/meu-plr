import type { IPlrCalculator } from "../../domain/interfaces/IPlrCalculator.ts";
import { BANKS, type BankId } from "../../domain/value-objects/Bank.ts";
import { InvalidBankError } from "../../domain/errors/index.ts";
import { FenabanCalculator } from "./FenabanCalculator.ts";
import { ItauCalculator } from "./ItauCalculator.ts";
import { SantanderCalculator } from "./SantanderCalculator.ts";
import { BradescoCalculator } from "./BradescoCalculator.ts";
import { BbCalculator } from "./BbCalculator.ts";
import { CaixaCalculator } from "./CaixaCalculator.ts";

export function createCalculator(bankId: BankId, multiplicador?: number): IPlrCalculator {
  switch (bankId) {
    case BANKS.ITAU:
      return new ItauCalculator(multiplicador);
    case BANKS.SANTANDER:
      return new SantanderCalculator(multiplicador);
    case BANKS.BRADESCO:
      return new BradescoCalculator(multiplicador);
    case BANKS.BB:
      return new BbCalculator(multiplicador);
    case BANKS.CAIXA:
      return new CaixaCalculator(multiplicador);
    case BANKS.SAFRA:
      return new FenabanCalculator();
    default:
      throw new InvalidBankError(bankId);
  }
}
