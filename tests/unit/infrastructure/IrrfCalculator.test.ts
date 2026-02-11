import { describe, it, expect } from "vitest";
import { IrrfCalculator } from "../../../src/infrastructure/tax/IrrfCalculator";

describe("IrrfCalculator", () => {
  const calc = new IrrfCalculator();

  it("isento ate R$ 6.677,55", () => {
    const result = calc.calculate(6000);
    expect(result.irrf).toBe(0);
    expect(result.faixa).toBe("Isento");
  });

  it("7,5% de R$ 6.677,56 a R$ 9.922,28", () => {
    const result = calc.calculate(8000);
    // 8000 * 0.075 - 500.82 = 99.18
    expect(result.irrf).toBe(99.18);
    expect(result.faixa).toBe("7,5%");
    expect(result.aliquota).toBe(0.075);
  });

  it("15% de R$ 9.922,29 a R$ 13.167,00", () => {
    const result = calc.calculate(11000);
    // 11000 * 0.15 - 1244.99 = 405.01
    expect(result.irrf).toBe(405.01);
    expect(result.faixa).toBe("15%");
  });

  it("22,5% de R$ 13.167,01 a R$ 16.380,38", () => {
    const result = calc.calculate(15000);
    // 15000 * 0.225 - 2232.51 = 1142.49
    expect(result.irrf).toBe(1142.49);
    expect(result.faixa).toBe("22,5%");
  });

  it("27,5% acima de R$ 16.380,38", () => {
    const result = calc.calculate(20000);
    // 20000 * 0.275 - 3051.53 = 2448.47
    expect(result.irrf).toBe(2448.47);
    expect(result.faixa).toBe("27,5%");
  });

  it("valor zero retorna isento", () => {
    const result = calc.calculate(0);
    expect(result.irrf).toBe(0);
    expect(result.faixa).toBe("Isento");
  });

  it("valor negativo retorna isento", () => {
    const result = calc.calculate(-500);
    expect(result.irrf).toBe(0);
  });

  it("limite exato da primeira faixa e isento", () => {
    const result = calc.calculate(6677.55);
    expect(result.irrf).toBe(0);
    expect(result.faixa).toBe("Isento");
  });
});
