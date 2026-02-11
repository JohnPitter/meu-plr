import { FenabanCalculator } from "./FenabanCalculator.ts";

// Banco do Brasil: Modulo BB (4% do lucro liquido + parcelas variaveis)
// Valor estimado por funcionario (referencia 2024)
const MODULO_BB_DEFAULT = 3500.0;

export class BbCalculator extends FenabanCalculator {
  readonly valorPrograma: number;

  constructor(valorPrograma?: number) {
    super();
    this.valorPrograma = valorPrograma ?? MODULO_BB_DEFAULT;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: this.valorPrograma, name: "Modulo BB (4% do lucro liquido)" };
  }
}
