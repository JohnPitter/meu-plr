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
  programaDefault?: number;
  programaLabel?: string;
  programaHint?: string;
}

export const BANK_LIST: BankInfo[] = [
  { id: BANKS.ITAU, name: "Itau Unibanco", hasAdditionalProgram: true, additionalProgramName: "PCR", programaDefault: 4096.42, programaLabel: "Valor PCR (R$)", programaHint: "2o patamar (ROE > 22,1%): R$ 4.096,42 | 1o patamar: R$ 3.908,05" },
  { id: BANKS.SANTANDER, name: "Santander", hasAdditionalProgram: true, additionalProgramName: "PPRS", programaDefault: 3880.84, programaLabel: "Valor PPRS (R$)", programaHint: "Valor fixo igual para todos, baseado no ROAE do banco" },
  { id: BANKS.BRADESCO, name: "Bradesco", hasAdditionalProgram: true, additionalProgramName: "PRB", programaDefault: 2500, programaLabel: "Valor PRB (R$)", programaHint: "ROAE 18,5%: R$ 2.500 | ROAE 17%: R$ 2.000 | Minimo: R$ 1.000" },
  { id: BANKS.BB, name: "Banco do Brasil", hasAdditionalProgram: true, additionalProgramName: "Modulo BB", programaDefault: 3500, programaLabel: "Valor Modulo BB (R$)", programaHint: "4% do lucro liquido + parcela variavel por desempenho (estimativa)" },
  { id: BANKS.CAIXA, name: "Caixa Economica Federal", hasAdditionalProgram: true, additionalProgramName: "PLR Social", programaDefault: 3200, programaLabel: "Valor PLR Social (R$)", programaHint: "4% do lucro liquido distribuido linearmente entre empregados" },
  { id: BANKS.SAFRA, name: "Banco Safra", hasAdditionalProgram: false },
];

export function getBankInfo(bankId: BankId): BankInfo {
  const bank = BANK_LIST.find((b) => b.id === bankId);
  if (!bank) throw new Error(`Banco nao encontrado: ${bankId}`);
  return bank;
}
