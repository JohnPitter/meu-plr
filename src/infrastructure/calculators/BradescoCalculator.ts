import { FenabanCalculator } from "./FenabanCalculator.ts";

// PLR Social Bradesco: 3% do lucro liquido distribuido linearmente
// Valor estimado por funcionario (referencia 2024)
const PLR_SOCIAL_DEFAULT = 2800.0;

export class BradescoCalculator extends FenabanCalculator {
  readonly valorPrograma: number;

  constructor(valorPrograma?: number) {
    super();
    this.valorPrograma = valorPrograma ?? PLR_SOCIAL_DEFAULT;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: this.valorPrograma, name: "PLR Social (3% do lucro liquido)" };
  }
}
