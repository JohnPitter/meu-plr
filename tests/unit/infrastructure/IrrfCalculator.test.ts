import { describe, it, expect } from "vitest";
import { IrrfCalculator } from "../../../src/infrastructure/tax/IrrfCalculator";

describe("IrrfCalculator", () => {
  const calc = new IrrfCalculator();

  it("isento ate R$ 7.640,80", () => {
    const result = calc.calculate(7000);
    expect(result.irrf).toBe(0);
    expect(result.faixa).toBe("Isento");
  });

  it("7,5% de R$ 7.640,81 a R$ 9.922,28", () => {
    const result = calc.calculate(8000);
    // 8000 * 0.075 - 573.06 = 26.94
    expect(result.irrf).toBe(26.94);
    expect(result.faixa).toBe("7,5%");
    expect(result.aliquota).toBe(0.075);
  });

  it("15% de R$ 9.922,29 a R$ 13.167,00", () => {
    const result = calc.calculate(11000);
    // 11000 * 0.15 - 1317.23 = 332.77
    expect(result.irrf).toBe(332.77);
    expect(result.faixa).toBe("15%");
  });

  it("22,5% de R$ 13.167,01 a R$ 16.380,38", () => {
    const result = calc.calculate(15000);
    // 15000 * 0.225 - 2304.76 = 1070.24
    expect(result.irrf).toBe(1070.24);
    expect(result.faixa).toBe("22,5%");
  });

  it("27,5% acima de R$ 16.380,38", () => {
    const result = calc.calculate(20000);
    // 20000 * 0.275 - 3123.78 = 2376.22
    expect(result.irrf).toBe(2376.22);
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
    const result = calc.calculate(7640.80);
    expect(result.irrf).toBe(0);
    expect(result.faixa).toBe("Isento");
  });
});
