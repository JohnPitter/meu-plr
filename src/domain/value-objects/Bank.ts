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
  programaInputType?: "multiplicador" | "valor";
  programaDefault?: number;
  programaLabel?: string;
  programaHint?: string;
}

export const BANK_LIST: BankInfo[] = [
  { id: BANKS.ITAU, name: "Itau Unibanco", hasAdditionalProgram: true, additionalProgramName: "PCR", programaInputType: "multiplicador", programaDefault: 2.2, programaLabel: "Multiplicador PCR (ROE)", programaHint: "Fator anunciado pelo banco com base no ROE" },
  { id: BANKS.SANTANDER, name: "Santander", hasAdditionalProgram: true, additionalProgramName: "PPRS", programaInputType: "multiplicador", programaDefault: 2.2, programaLabel: "Multiplicador PPRS (ROAE)", programaHint: "Fator anunciado pelo banco com base no ROAE" },
  { id: BANKS.BRADESCO, name: "Bradesco", hasAdditionalProgram: true, additionalProgramName: "PLR Social", programaInputType: "valor", programaDefault: 2800, programaLabel: "Valor PLR Social (R$)", programaHint: "3% do lucro liquido distribuido entre funcionarios" },
  { id: BANKS.BB, name: "Banco do Brasil", hasAdditionalProgram: true, additionalProgramName: "Modulo BB", programaInputType: "valor", programaDefault: 3500, programaLabel: "Valor Modulo BB (R$)", programaHint: "4% do lucro liquido + parcelas variaveis" },
  { id: BANKS.CAIXA, name: "Caixa Economica Federal", hasAdditionalProgram: true, additionalProgramName: "PLR Social", programaInputType: "valor", programaDefault: 3200, programaLabel: "Valor PLR Social (R$)", programaHint: "4% do lucro liquido distribuido entre funcionarios" },
  { id: BANKS.SAFRA, name: "Banco Safra", hasAdditionalProgram: false },
];

export function getBankInfo(bankId: BankId): BankInfo {
  const bank = BANK_LIST.find((b) => b.id === bankId);
  if (!bank) throw new Error(`Banco nao encontrado: ${bankId}`);
  return bank;
}
