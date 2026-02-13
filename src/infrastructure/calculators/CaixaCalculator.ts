import type { PlrBreakdown } from "../../domain/entities/PlrCalculation.ts";
import { FenabanCalculator } from "./FenabanCalculator.ts";

// Caixa Economica Federal (ACT 2024/2026)
// Antecipacao: 50% do exercicio (diferente dos 60% dos bancos privados)
// 45% do salario + R$ 1.766,46 (teto R$ 9.476,20)
const CAIXA_ANTECIPACAO_PERCENTUAL = 0.45;
const CAIXA_ANTECIPACAO_VALOR_FIXO = 1766.46;
const CAIXA_ANTECIPACAO_TETO = 9476.20;

// PLR Social: 4% do lucro liquido distribuido linearmente
const PLR_SOCIAL_DEFAULT = 3200.0;

// Teto de 3 remuneracoes base
const TETO_MULTIPLICADOR = 3;

export class CaixaCalculator extends FenabanCalculator {
  readonly valorPLRSocial: number;

  constructor(valorPLRSocial?: number) {
    super(false); // sem majoracao (Caixa usa regra basica padrao)
    this.valorPLRSocial = valorPLRSocial ?? PLR_SOCIAL_DEFAULT;
  }

  override calculateAntecipacao(salario: number): { regraBasica: number; parcelaAdicional: number } {
    // Caixa: 50% do exercicio (45% salario + fixo proprio)
    const regraBasica = Math.min(
      salario * CAIXA_ANTECIPACAO_PERCENTUAL + CAIXA_ANTECIPACAO_VALOR_FIXO,
      CAIXA_ANTECIPACAO_TETO,
    );
    // Parcela adicional: mesma da Fenaban (2,2% do lucro 1o semestre)
    const fenaban = super.calculateAntecipacao(salario);
    return {
      regraBasica: Math.round(regraBasica * 100) / 100,
      parcelaAdicional: fenaban.parcelaAdicional,
    };
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: this.valorPLRSocial, name: "PLR Social (4% do lucro líquido)" };
  }

  override getBreakdown(salario: number, meses: number): PlrBreakdown {
    const breakdown = super.getBreakdown(salario, meses);

    // Teto de 3 remuneracoes base
    const teto = salario * TETO_MULTIPLICADOR;
    const totalSemTeto = breakdown.totalAntecipacao + breakdown.totalExercicio + breakdown.programaComplementar;

    if (totalSemTeto > teto) {
      const fator = teto / totalSemTeto;
      return {
        ...breakdown,
        totalAntecipacao: Math.round(breakdown.totalAntecipacao * fator * 100) / 100,
        totalExercicio: Math.round(breakdown.totalExercicio * fator * 100) / 100,
        programaComplementar: Math.round(breakdown.programaComplementar * fator * 100) / 100,
      };
    }

    return breakdown;
  }
}
