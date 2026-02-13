import { describe, it, expect } from "vitest";
import { IrrfCalculator } from "../../../src/infrastructure/tax/IrrfCalculator";

const calc = new IrrfCalculator();

describe("IrrfCalculator — fronteiras exatas das faixas", () => {
  // Lei 14.663/2023 — tabela exclusiva PLR
  // Faixa 1: ate 7.640,80 → isento
  // Faixa 2: 7.640,81 a 9.922,28 → 7,5% - 573,06
  // Faixa 3: 9.922,29 a 13.167,00 → 15% - 1.317,23
  // Faixa 4: 13.167,01 a 16.380,38 → 22,5% - 2.304,76
  // Faixa 5: acima de 16.380,38 → 27,5% - 3.123,78

  it("R$ 7.640,80 (limite exato faixa isenta) = isento", () => {
    const r = calc.calculate(7640.80);
    expect(r.irrf).toBe(0);
    expect(r.faixa).toBe("Isento");
    expect(r.aliquota).toBe(0);
  });

  it("R$ 7.640,81 (1 centavo acima) = faixa 7,5%", () => {
    const r = calc.calculate(7640.81);
    // 7640.81 * 0.075 - 573.06 = 573.06075 - 573.06 = 0.00075 → arredonda 0.00
    expect(r.faixa).toBe("7,5%");
    expect(r.aliquota).toBe(0.075);
    expect(r.irrf).toBeGreaterThanOrEqual(0);
  });

  it("R$ 9.922,28 (limite exato faixa 7,5%) = faixa 7,5%", () => {
    const r = calc.calculate(9922.28);
    // 9922.28 * 0.075 - 573.06 = 744.171 - 573.06 = 171.11
    expect(r.irrf).toBe(171.11);
    expect(r.faixa).toBe("7,5%");
  });

  it("R$ 9.922,29 (1 centavo acima) = faixa 15%", () => {
    const r = calc.calculate(9922.29);
    // 9922.29 * 0.15 - 1317.23 = 1488.3435 - 1317.23 = 171.11
    expect(r.faixa).toBe("15%");
    expect(r.aliquota).toBe(0.15);
    expect(r.irrf).toBeCloseTo(171.11, 1);
  });

  it("R$ 13.167,00 (limite exato faixa 15%) = faixa 15%", () => {
    const r = calc.calculate(13167.00);
    // 13167.00 * 0.15 - 1317.23 = 1975.05 - 1317.23 = 657.82
    expect(r.irrf).toBe(657.82);
    expect(r.faixa).toBe("15%");
  });

  it("R$ 13.167,01 (1 centavo acima) = faixa 22,5%", () => {
    const r = calc.calculate(13167.01);
    expect(r.faixa).toBe("22,5%");
    expect(r.aliquota).toBe(0.225);
    // 13167.01 * 0.225 - 2304.76 = 2962.57725 - 2304.76 = 657.82
    expect(r.irrf).toBeCloseTo(657.82, 1);
  });

  it("R$ 16.380,38 (limite exato faixa 22,5%) = faixa 22,5%", () => {
    const r = calc.calculate(16380.38);
    // 16380.38 * 0.225 - 2304.76 = 3685.5855 - 2304.76 = 1380.83
    expect(r.irrf).toBeCloseTo(1380.83, 1);
    expect(r.faixa).toBe("22,5%");
  });

  it("R$ 16.380,39 (1 centavo acima) = faixa 27,5%", () => {
    const r = calc.calculate(16380.39);
    expect(r.faixa).toBe("27,5%");
    expect(r.aliquota).toBe(0.275);
    // 16380.39 * 0.275 - 3123.78 = 4504.60725 - 3123.78 = 1380.83
    expect(r.irrf).toBeCloseTo(1380.83, 1);
  });

  it("valor muito alto (R$ 100.000) = faixa 27,5%", () => {
    const r = calc.calculate(100000);
    // 100000 * 0.275 - 3123.78 = 27500 - 3123.78 = 24376.22
    expect(r.irrf).toBe(24376.22);
    expect(r.faixa).toBe("27,5%");
  });

  it("irrf nunca e negativo em nenhuma faixa", () => {
    const valores = [0, 1, 100, 7640.80, 7640.81, 9922.28, 9922.29, 13167.00, 13167.01, 16380.38, 16380.39, 50000];
    for (const v of valores) {
      const r = calc.calculate(v);
      expect(r.irrf).toBeGreaterThanOrEqual(0);
    }
  });

  it("continuidade: faixas adjacentes produzem IRRF proximo na fronteira", () => {
    // Na fronteira entre faixas, o IRRF deve ser quase igual
    const abaixo = calc.calculate(9922.28);
    const acima = calc.calculate(9922.29);
    expect(Math.abs(abaixo.irrf - acima.irrf)).toBeLessThan(0.1);

    const abaixo2 = calc.calculate(13167.00);
    const acima2 = calc.calculate(13167.01);
    expect(Math.abs(abaixo2.irrf - acima2.irrf)).toBeLessThan(0.1);

    const abaixo3 = calc.calculate(16380.38);
    const acima3 = calc.calculate(16380.39);
    expect(Math.abs(abaixo3.irrf - acima3.irrf)).toBeLessThan(0.1);
  });
});
