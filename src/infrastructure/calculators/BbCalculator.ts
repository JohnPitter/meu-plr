import { FenabanCalculator } from "./FenabanCalculator.ts";

// Banco do Brasil: Modulo Fenaban + Modulo BB
// Modulo Fenaban: 45% do salario paradigma + parcela fixa (definida pelo banco)
// Modulo BB: 4% do lucro liquido (distribuicao linear) + parcela variavel (desempenho)
// Nota: o salario paradigma difere do salario real e varia por cargo.
// Como nao temos acesso ao salario paradigma, usamos a regra Fenaban padrao
// como aproximacao, mais o valor estimado do modulo BB.
const MODULO_BB_DEFAULT = 3500.0;

export class BbCalculator extends FenabanCalculator {
  readonly valorModuloBB: number;

  constructor(valorModuloBB?: number) {
    super(false); // sem majoracao (BB usa estrutura propria)
    this.valorModuloBB = valorModuloBB ?? MODULO_BB_DEFAULT;
  }

  override calculateProgramaComplementar(_salario: number): { value: number; name: string | null } {
    return { value: this.valorModuloBB, name: "Modulo BB (4% do lucro liquido + variavel)" };
  }
}
