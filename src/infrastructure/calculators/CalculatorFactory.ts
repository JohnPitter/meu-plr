import type { IPlrCalculator } from "../../domain/interfaces/IPlrCalculator.ts";
import { BANKS, type BankId } from "../../domain/value-objects/Bank.ts";
import { InvalidBankError } from "../../domain/errors/index.ts";
import { FenabanCalculator } from "./FenabanCalculator.ts";
import { ItauCalculator } from "./ItauCalculator.ts";
import { SantanderCalculator } from "./SantanderCalculator.ts";
import { BradescoCalculator } from "./BradescoCalculator.ts";
import { BbCalculator } from "./BbCalculator.ts";
import { CaixaCalculator } from "./CaixaCalculator.ts";

const calculators: Record<BankId, () => IPlrCalculator> = {
  [BANKS.ITAU]: () => new ItauCalculator(),
  [BANKS.SANTANDER]: () => new SantanderCalculator(),
  [BANKS.BRADESCO]: () => new BradescoCalculator(),
  [BANKS.BB]: () => new BbCalculator(),
  [BANKS.CAIXA]: () => new CaixaCalculator(),
  [BANKS.SAFRA]: () => new FenabanCalculator(),
};

export function createCalculator(bankId: BankId): IPlrCalculator {
  const factory = calculators[bankId];
  if (!factory) throw new InvalidBankError(bankId);
  return factory();
}
