import { describe, it, expect } from "vitest";
import { ItauCalculator } from "../../../src/infrastructure/calculators/ItauCalculator";
import { SantanderCalculator } from "../../../src/infrastructure/calculators/SantanderCalculator";
import { BradescoCalculator } from "../../../src/infrastructure/calculators/BradescoCalculator";
import { BbCalculator } from "../../../src/infrastructure/calculators/BbCalculator";
import { CaixaCalculator } from "../../../src/infrastructure/calculators/CaixaCalculator";
import { createCalculator } from "../../../src/infrastructure/calculators/CalculatorFactory";
import { BANKS } from "../../../src/domain/value-objects/Bank";

describe("ItauCalculator", () => {
  const calc = new ItauCalculator();

  it("inclui PCR no programa complementar (2o patamar default)", () => {
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(4299.86);
    expect(result.name).toContain("PCR");
  });

  it("aceita valor PCR customizado", () => {
    const custom = new ItauCalculator(3908.05);
    const result = custom.calculateProgramaComplementar(5000);
    expect(result.value).toBe(3908.05);
  });

  it("herda regra basica Fenaban com majoracao", () => {
    const result = calc.calculateAntecipacao(5000);
    // Antecipacao nao e majorada: 54% * 5000 + 2119.75 = 4819.75
    expect(result.regraBasica).toBe(4819.75);
  });

  it("exercicio usa majoracao", () => {
    const result = calc.calculateExercicio(5000);
    // majorada: min(2.2 * 5000, 41695.29) = 11000
    expect(result.regraBasica).toBe(11000);
  });
});

describe("SantanderCalculator", () => {
  it("inclui PPRS no programa complementar", () => {
    const calc = new SantanderCalculator();
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(3880.84);
    expect(result.name).toContain("PPRS");
  });

  it("aceita valor PPRS customizado", () => {
    const calc = new SantanderCalculator(4000);
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(4000);
  });

  it("exercicio usa majoracao", () => {
    const calc = new SantanderCalculator();
    const result = calc.calculateExercicio(5000);
    expect(result.regraBasica).toBe(11000);
  });
});

describe("BradescoCalculator", () => {
  it("inclui PRB no programa complementar", () => {
    const calc = new BradescoCalculator();
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(2500);
    expect(result.name).toContain("PRB");
  });

  it("aceita valor customizado em R$", () => {
    const calc = new BradescoCalculator(1000);
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(1000);
  });

  it("exercicio usa majoracao", () => {
    const calc = new BradescoCalculator();
    const result = calc.calculateExercicio(5000);
    expect(result.regraBasica).toBe(11000);
  });
});

describe("BbCalculator", () => {
  it("inclui Módulo BB no programa complementar", () => {
    const calc = new BbCalculator();
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(3500);
    expect(result.name).toContain("Módulo BB");
  });

  it("exercicio nao usa majoracao", () => {
    const calc = new BbCalculator();
    const result = calc.calculateExercicio(5000);
    // Sem majoracao: min(0.9 * 5000 + 3532.92, 18952.40) = 8032.92
    expect(result.regraBasica).toBe(8032.92);
  });
});

describe("CaixaCalculator", () => {
  const calc = new CaixaCalculator();

  it("inclui PLR Social", () => {
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(3200);
  });

  it("antecipacao usa formula Caixa (50% do exercicio)", () => {
    const result = calc.calculateAntecipacao(5000);
    // 45% * 5000 + 1766.46 = 4016.46
    expect(result.regraBasica).toBe(4016.46);
  });

  it("aplica teto de 3 remuneracoes", () => {
    // Para salario de 3000, teto = 9000
    const breakdown = calc.getBreakdown(3000, 12);
    const total = breakdown.totalAntecipacao + breakdown.totalExercicio + breakdown.programaComplementar;
    expect(total).toBeLessThanOrEqual(3000 * 3);
  });
});

describe("BTG Pactual (Fenaban com majoracao)", () => {
  it("cria calculadora via factory", () => {
    const calc = createCalculator(BANKS.BTG);
    expect(calc).toBeDefined();
  });

  it("exercicio usa majoracao", () => {
    const calc = createCalculator(BANKS.BTG);
    const result = calc.calculateExercicio(5000);
    // majorada: min(2.2 * 5000, 41695.29) = 11000
    expect(result.regraBasica).toBe(11000);
  });

  it("sem programa complementar", () => {
    const calc = createCalculator(BANKS.BTG);
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(0);
    expect(result.name).toBeNull();
  });
});

describe("CalculatorFactory", () => {
  it("cria calculadora para cada banco", () => {
    for (const bankId of Object.values(BANKS)) {
      const calculator = createCalculator(bankId);
      expect(calculator).toBeDefined();
      expect(calculator.getBreakdown).toBeDefined();
    }
  });

  it("erro para banco invalido", () => {
    expect(() => createCalculator("fake" as never)).toThrow();
  });
});
