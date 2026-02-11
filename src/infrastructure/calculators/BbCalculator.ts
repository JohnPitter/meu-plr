import { FenabanCalculator } from "./FenabanCalculator.ts";

// Banco do Brasil: Modulo BB (4% do lucro liquido + parcelas variaveis)
// Valor estimado por funcionario (referencia 2024)
const MODULO_BB_VALOR_BASE = 3500.0;

export class BbCalculator extends FenabanCalculator {
  readonly multiplicador: number;

  constructor(multiplicador?: number) {
    super();
    this.multiplicador = multiplicador ?? 1.0;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    const value = Math.round(MODULO_BB_VALOR_BASE * this.multiplicador * 100) / 100;
    return { value, name: `Modulo BB (${this.multiplicador}x)` };
  }
}
