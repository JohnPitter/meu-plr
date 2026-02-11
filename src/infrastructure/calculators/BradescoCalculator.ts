import { FenabanCalculator } from "./FenabanCalculator.ts";

// PLR Social Bradesco: 3% do lucro liquido distribuido linearmente
// Valor estimado por funcionario (referencia 2024)
const PLR_SOCIAL_VALOR_BASE = 2800.0;

export class BradescoCalculator extends FenabanCalculator {
  readonly multiplicador: number;

  constructor(multiplicador?: number) {
    super();
    this.multiplicador = multiplicador ?? 1.0;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    const value = Math.round(PLR_SOCIAL_VALOR_BASE * this.multiplicador * 100) / 100;
    return { value, name: `PLR Social (${this.multiplicador}x)` };
  }
}
