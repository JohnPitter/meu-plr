import type { IPlrCalculator } from "../../domain/interfaces/IPlrCalculator.ts";
import { BANKS, type BankId } from "../../domain/value-objects/Bank.ts";
import { InvalidBankError } from "../../domain/errors/index.ts";
import { FenabanCalculator } from "./FenabanCalculator.ts";
import { ItauCalculator } from "./ItauCalculator.ts";
import { SantanderCalculator } from "./SantanderCalculator.ts";
import { BradescoCalculator } from "./BradescoCalculator.ts";
import { BbCalculator } from "./BbCalculator.ts";
import { CaixaCalculator } from "./CaixaCalculator.ts";

export function createCalculator(bankId: BankId): IPlrCalculator {
  switch (bankId) {
    case BANKS.ITAU:
      return new ItauCalculator();
    case BANKS.SANTANDER:
      return new SantanderCalculator();
    case BANKS.BRADESCO:
      return new BradescoCalculator();
    case BANKS.BB:
      return new BbCalculator();
    case BANKS.CAIXA:
      return new CaixaCalculator();
    case BANKS.SAFRA:
      return new FenabanCalculator();
    default:
      throw new InvalidBankError(bankId);
  }
}
