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
  hasMultiplicador?: boolean;
  multiplicadorDefault?: number;
  multiplicadorLabel?: string;
}

export const BANK_LIST: BankInfo[] = [
  { id: BANKS.ITAU, name: "Itau Unibanco", hasAdditionalProgram: true, additionalProgramName: "PCR", hasMultiplicador: true, multiplicadorDefault: 2.2, multiplicadorLabel: "Multiplicador PCR (ROE)" },
  { id: BANKS.SANTANDER, name: "Santander", hasAdditionalProgram: true, additionalProgramName: "PPRS", hasMultiplicador: true, multiplicadorDefault: 2.2, multiplicadorLabel: "Multiplicador PPRS (ROAE)" },
  { id: BANKS.BRADESCO, name: "Bradesco", hasAdditionalProgram: true, additionalProgramName: "PLR Social", hasMultiplicador: true, multiplicadorDefault: 1.0, multiplicadorLabel: "Multiplicador PLR Social" },
  { id: BANKS.BB, name: "Banco do Brasil", hasAdditionalProgram: true, additionalProgramName: "Modulo BB", hasMultiplicador: true, multiplicadorDefault: 1.0, multiplicadorLabel: "Multiplicador Modulo BB" },
  { id: BANKS.CAIXA, name: "Caixa Economica Federal", hasAdditionalProgram: true, additionalProgramName: "PLR Social", hasMultiplicador: true, multiplicadorDefault: 1.0, multiplicadorLabel: "Multiplicador PLR Social" },
  { id: BANKS.SAFRA, name: "Banco Safra", hasAdditionalProgram: false },
];

export function getBankInfo(bankId: BankId): BankInfo {
  const bank = BANK_LIST.find((b) => b.id === bankId);
  if (!bank) throw new Error(`Banco nao encontrado: ${bankId}`);
  return bank;
}
