import type { ITaxCalculator } from "../../domain/interfaces/ITaxCalculator.ts";

export interface DiscoverMultiplierInput {
  salario: number;
  brutoPrimeiraParcela: number;
  brutoSegundaParcela: number;
}

export interface DiscoverMultiplierResult {
  totalBruto: number;
  multiplicador: number;
  irrfPrimeiraParcela: number;
  liquidoPrimeiraParcela: number;
  irrfSegundaParcela: number;
  liquidoSegundaParcela: number;
  irrfTotal: number;
  totalLiquido: number;
  faixa: string;
}

export class DiscoverMultiplier {
  readonly taxCalculator: ITaxCalculator;

  constructor(taxCalculator: ITaxCalculator) {
    this.taxCalculator = taxCalculator;
  }

  execute(input: DiscoverMultiplierInput): DiscoverMultiplierResult {
    const { salario, brutoPrimeiraParcela, brutoSegundaParcela } = input;

    if (salario <= 0) throw new Error("Salario deve ser maior que zero");
    if (brutoPrimeiraParcela < 0) throw new Error("Bruto da 1a parcela invalido");
    if (brutoSegundaParcela < 0) throw new Error("Bruto da 2a parcela invalido");

    const totalBruto = Math.round((brutoPrimeiraParcela + brutoSegundaParcela) * 100) / 100;
    const multiplicador = Math.round((totalBruto / salario) * 10) / 10;

    // IRRF da 1a parcela (retido exclusivamente sobre a antecipacao)
    const tax1a = this.taxCalculator.calculate(brutoPrimeiraParcela);
    const irrfPrimeiraParcela = tax1a.irrf;
    const liquidoPrimeiraParcela = Math.round((brutoPrimeiraParcela - irrfPrimeiraParcela) * 100) / 100;

    // IRRF da 2a parcela = IRRF(total) - IRRF(1a), nunca negativo
    const taxTotal = this.taxCalculator.calculate(totalBruto);
    const irrfSegundaParcela = Math.max(0, Math.round((taxTotal.irrf - irrfPrimeiraParcela) * 100) / 100);
    const liquidoSegundaParcela = Math.round((brutoSegundaParcela - irrfSegundaParcela) * 100) / 100;

    const totalLiquido = Math.round((liquidoPrimeiraParcela + liquidoSegundaParcela) * 100) / 100;

    return {
      totalBruto,
      multiplicador,
      irrfPrimeiraParcela,
      liquidoPrimeiraParcela,
      irrfSegundaParcela,
      liquidoSegundaParcela,
      irrfTotal: taxTotal.irrf,
      totalLiquido,
      faixa: taxTotal.faixa,
    };
  }
}
