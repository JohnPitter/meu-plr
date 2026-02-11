export const BANKS = {
  ITAU: "itau",
  SANTANDER: "santander",
  BRADESCO: "bradesco",
  BB: "bb",
  CAIXA: "caixa",
  SAFRA: "safra",
} as const;

export type BankId = (typeof BANKS)[keyof typeof BANKS];

export interface BankInfo {
  id: BankId;
  name: string;
  hasAdditionalProgram: boolean;
  additionalProgramName?: string;
}

export const BANK_LIST: BankInfo[] = [
  { id: BANKS.ITAU, name: "Itau Unibanco", hasAdditionalProgram: true, additionalProgramName: "PCR" },
  { id: BANKS.SANTANDER, name: "Santander", hasAdditionalProgram: true, additionalProgramName: "PPRS" },
  { id: BANKS.BRADESCO, name: "Bradesco", hasAdditionalProgram: true, additionalProgramName: "PRB" },
  { id: BANKS.BB, name: "Banco do Brasil", hasAdditionalProgram: true, additionalProgramName: "Modulo BB" },
  { id: BANKS.CAIXA, name: "Caixa Economica Federal", hasAdditionalProgram: true, additionalProgramName: "PLR Social" },
  { id: BANKS.SAFRA, name: "Banco Safra", hasAdditionalProgram: false },
];

export function getBankInfo(bankId: BankId): BankInfo {
  const bank = BANK_LIST.find((b) => b.id === bankId);
  if (!bank) throw new Error(`Banco nao encontrado: ${bankId}`);
  return bank;
}
