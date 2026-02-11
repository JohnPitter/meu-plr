import type { PlrBreakdown } from "../../domain/entities/PlrCalculation.ts";
import type { IPlrCalculator } from "../../domain/interfaces/IPlrCalculator.ts";

// CCT FENABAN 2024/2025 — valores corrigidos 5,68%
const ANTECIPACAO_PERCENTUAL = 0.54;
const ANTECIPACAO_VALOR_FIXO = 1517.72;
const ANTECIPACAO_TETO = 8141.83;

const EXERCICIO_PERCENTUAL = 0.90;
const EXERCICIO_VALOR_FIXO = 3792.41;
const EXERCICIO_TETO = 18098.98;

const PARCELA_ADICIONAL_ANTECIPACAO = 2529.54;
const PARCELA_ADICIONAL_EXERCICIO = 758.47;

export class FenabanCalculator implements IPlrCalculator {
  calculateAntecipacao(salario: number): { regraBasica: number; parcelaAdicional: number } {
    const regraBasica = Math.min(
      salario * ANTECIPACAO_PERCENTUAL + ANTECIPACAO_VALOR_FIXO,
      ANTECIPACAO_TETO,
    );
    return {
      regraBasica: Math.round(regraBasica * 100) / 100,
      parcelaAdicional: PARCELA_ADICIONAL_ANTECIPACAO,
    };
  }

  calculateExercicio(salario: number): { regraBasica: number; parcelaAdicional: number } {
    const regraBasica = Math.min(
      salario * EXERCICIO_PERCENTUAL + EXERCICIO_VALOR_FIXO,
      EXERCICIO_TETO,
    );
    return {
      regraBasica: Math.round(regraBasica * 100) / 100,
      parcelaAdicional: PARCELA_ADICIONAL_EXERCICIO,
    };
  }

  calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: 0, name: null };
  }

  getBreakdown(salario: number, meses: number): PlrBreakdown {
    const proportion = meses / 12;
    const antecipacao = this.calculateAntecipacao(salario);
    const exercicio = this.calculateExercicio(salario);
    const complementar = this.calculateProgramaComplementar(salario);

    const totalAntecipacao = Math.round((antecipacao.regraBasica + antecipacao.parcelaAdicional) * proportion * 100) / 100;

    const totalExercicioSemDesconto = Math.round((exercicio.regraBasica + exercicio.parcelaAdicional) * proportion * 100) / 100;
    const totalExercicio = Math.round((totalExercicioSemDesconto - totalAntecipacao) * 100) / 100;

    return {
      regraBasicaAntecipacao: Math.round(antecipacao.regraBasica * proportion * 100) / 100,
      parcelaAdicionalAntecipacao: Math.round(antecipacao.parcelaAdicional * proportion * 100) / 100,
      totalAntecipacao,
      regraBasicaExercicio: Math.round(exercicio.regraBasica * proportion * 100) / 100,
      parcelaAdicionalExercicio: Math.round(exercicio.parcelaAdicional * proportion * 100) / 100,
      totalExercicioSemDesconto,
      descontoAntecipacao: totalAntecipacao,
      totalExercicio,
      programaComplementar: Math.round(complementar.value * proportion * 100) / 100,
      programaComplementarNome: complementar.name,
    };
  }
}
