import { FenabanCalculator } from "./FenabanCalculator.ts";

// PLR Social Bradesco: 3% do lucro liquido distribuido linearmente
// Valor estimado por funcionario (referencia 2024)
const PLR_SOCIAL_VALOR_ESTIMADO = 2800.0;

export class BradescoCalculator extends FenabanCalculator {
  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: PLR_SOCIAL_VALOR_ESTIMADO, name: "PLR Social (3% do lucro liquido)" };
  }
}
