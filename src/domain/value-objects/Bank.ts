export const BANKS = {
  ITAU: "itau",
  SANTANDER: "santander",
  BRADESCO: "bradesco",
  BB: "bb",
  CAIXA: "caixa",
  BTG: "btg",
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
  { id: BANKS.BB, name: "Banco do Brasil", hasAdditionalProgram: true, additionalProgramName: "Módulo BB" },
  { id: BANKS.SAFRA, name: "Banco Safra", hasAdditionalProgram: false },
  { id: BANKS.BRADESCO, name: "Bradesco", hasAdditionalProgram: true, additionalProgramName: "PRB" },
  { id: BANKS.BTG, name: "BTG Pactual", hasAdditionalProgram: false },
  { id: BANKS.CAIXA, name: "Caixa Econômica Federal", hasAdditionalProgram: true, additionalProgramName: "PLR Social" },
  { id: BANKS.ITAU, name: "Itau Unibanco", hasAdditionalProgram: true, additionalProgramName: "PCR" },
  { id: BANKS.SANTANDER, name: "Santander", hasAdditionalProgram: true, additionalProgramName: "PPRS" },
];

export function getBankInfo(bankId: BankId): BankInfo {
  const bank = BANK_LIST.find((b) => b.id === bankId);
  if (!bank) throw new Error(`Banco não encontrado: ${bankId}`);
  return bank;
}
