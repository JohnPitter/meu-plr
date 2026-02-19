import type { PlrBreakdown } from "../../domain/entities/PlrCalculation.ts";
import type { IPlrCalculator } from "../../domain/interfaces/IPlrCalculator.ts";

// CCT FENABAN 2024/2026 — exercicio 2025, reajuste 5,68% (INPC 5,05% + 0,6% real)
const ANTECIPACAO_PERCENTUAL = 0.54;
const ANTECIPACAO_VALOR_FIXO = 2119.75;
const ANTECIPACAO_TETO = 11371.44;

const EXERCICIO_PERCENTUAL = 0.90;
const EXERCICIO_VALOR_FIXO = 3532.92;
const EXERCICIO_TETO = 18952.40;

// Majoracao: aplica quando o total de regra basica pago pelo banco < 5% do lucro
// Cada empregado recebe ate 2,2 salearios, limitado ao teto absoluto
const MAJORACAO_MULTIPLICADOR = 2.2;
const MAJORACAO_TETO = 41695.29;

// Parcela adicional: 2,2% do lucro liquido distribuido linearmente entre empregados
const PARCELA_ADICIONAL_ANTECIPACAO_TETO = 3668.29;
const PARCELA_ADICIONAL_EXERCICIO_TETO = 7336.60;

export class FenabanCalculator implements IPlrCalculator {
  readonly majoracao: boolean;
  readonly majoracaoTetoEfetivo: number;

  constructor(majoracao = false, majoracaoTetoEfetivo = MAJORACAO_TETO) {
    this.majoracao = majoracao;
    this.majoracaoTetoEfetivo = majoracaoTetoEfetivo;
  }

  calculateAntecipacao(salario: number): { regraBasica: number; parcelaAdicional: number } {
    const regraBasica = Math.min(
      salario * ANTECIPACAO_PERCENTUAL + ANTECIPACAO_VALOR_FIXO,
      ANTECIPACAO_TETO,
    );
    return {
      regraBasica: Math.round(regraBasica * 100) / 100,
      parcelaAdicional: PARCELA_ADICIONAL_ANTECIPACAO_TETO,
    };
  }

  calculateExercicio(salario: number): { regraBasica: number; parcelaAdicional: number } {
    const regraBasicaPadrao = Math.min(
      salario * EXERCICIO_PERCENTUAL + EXERCICIO_VALOR_FIXO,
      EXERCICIO_TETO,
    );

    let regraBasica = regraBasicaPadrao;

    if (this.majoracao) {
      const majorada = Math.min(salario * MAJORACAO_MULTIPLICADOR, this.majoracaoTetoEfetivo);
      regraBasica = Math.max(regraBasicaPadrao, majorada);
    }

    return {
      regraBasica: Math.round(regraBasica * 100) / 100,
      parcelaAdicional: PARCELA_ADICIONAL_EXERCICIO_TETO,
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
