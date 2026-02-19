import { FenabanCalculator } from "./FenabanCalculator.ts";

// PRB - Programa de Remuneracao Bradesco (ACT 2025/2026)
// Valores por faixa de ROAE:
// ROAE >= 15,5%:  R$ 1.000
// ROAE >= 17,0%:  R$ 2.000
// ROAE >= 18,5%:  R$ 2.500
// Exercicio 2025: Bradesco ROAE = 14,8% (abaixo do minimo 15,5%) → PRB nao pago
const PRB_DEFAULT = 0;

// Majoracao efetiva: a regra da CCT limita a majoracao individual ao menor entre
// 2,2 salarios (teto R$ 41.695,29) e o valor per capita necessario para que o total
// de regra basica atinja 5% do lucro liquido. Para o Bradesco (lucro ~R$ 24,6B,
// ~86 mil funcionarios), o teto efetivo per capita e R$ 22.620,16.
export const BRADESCO_MAJORACAO_TETO_EFETIVO = 22620.16;

export class BradescoCalculator extends FenabanCalculator {
  readonly valorPrograma: number;

  constructor(valorPrograma?: number, majoracaoTetoEfetivo?: number) {
    super(true, majoracaoTetoEfetivo ?? BRADESCO_MAJORACAO_TETO_EFETIVO);
    this.valorPrograma = valorPrograma ?? PRB_DEFAULT;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return {
      value: this.valorPrograma,
      name: this.valorPrograma > 0 ? "PRB (Programa de Remuneracao Bradesco)" : null,
    };
  }
}
