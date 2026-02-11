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

  it("inclui PCR no programa complementar", () => {
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(3144.98);
    expect(result.name).toContain("PCR");
  });

  it("herda regra basica Fenaban", () => {
    const result = calc.calculateAntecipacao(5000);
    expect(result.regraBasica).toBe(4217.72);
  });
});

describe("SantanderCalculator", () => {
  it("inclui PPRS no programa complementar", () => {
    const calc = new SantanderCalculator();
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(2614);
    expect(result.name).toContain("PPRS");
  });
});

describe("BradescoCalculator", () => {
  it("inclui PLR Social no programa complementar", () => {
    const calc = new BradescoCalculator();
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(2800);
    expect(result.name).toContain("PLR Social");
  });
});

describe("BbCalculator", () => {
  it("inclui Modulo BB no programa complementar", () => {
    const calc = new BbCalculator();
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(3500);
    expect(result.name).toContain("Modulo BB");
  });
});

describe("CaixaCalculator", () => {
  const calc = new CaixaCalculator();

  it("inclui PLR Social", () => {
    const result = calc.calculateProgramaComplementar(5000);
    expect(result.value).toBe(3200);
  });

  it("aplica teto de 3 remuneracoes", () => {
    // Para salario de 3000, teto = 9000
    const breakdown = calc.getBreakdown(3000, 12);
    const total = breakdown.totalAntecipacao + breakdown.totalExercicio + breakdown.programaComplementar;
    expect(total).toBeLessThanOrEqual(3000 * 3);
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
