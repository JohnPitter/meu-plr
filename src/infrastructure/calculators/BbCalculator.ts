import { FenabanCalculator } from "./FenabanCalculator.ts";

// Banco do Brasil: Modulo BB (4% do lucro liquido + parcelas variaveis)
// Valor estimado por funcionario (referencia 2024)
const MODULO_BB_VALOR_ESTIMADO = 3500.0;

export class BbCalculator extends FenabanCalculator {
  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: MODULO_BB_VALOR_ESTIMADO, name: "Modulo BB (4% do lucro liquido)" };
  }
}
