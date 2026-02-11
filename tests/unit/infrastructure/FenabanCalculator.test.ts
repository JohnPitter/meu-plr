import { describe, it, expect } from "vitest";
import { FenabanCalculator } from "../../../src/infrastructure/calculators/FenabanCalculator";

describe("FenabanCalculator (sem majoracao)", () => {
  const calc = new FenabanCalculator();

  describe("antecipacao", () => {
    it("calcula regra basica: 54% + R$ 2.119,75", () => {
      const result = calc.calculateAntecipacao(5000);
      // 5000 * 0.54 + 2119.75 = 4819.75
      expect(result.regraBasica).toBe(4819.75);
      expect(result.parcelaAdicional).toBe(3668.29);
    });

    it("respeita teto de R$ 11.371,44", () => {
      const result = calc.calculateAntecipacao(50000);
      // 50000 * 0.54 + 2119.75 = 29119.75 > teto
      expect(result.regraBasica).toBe(11371.44);
    });
  });

  describe("exercicio", () => {
    it("calcula regra basica: 90% + R$ 3.532,92", () => {
      const result = calc.calculateExercicio(5000);
      // 5000 * 0.90 + 3532.92 = 8032.92
      expect(result.regraBasica).toBe(8032.92);
      expect(result.parcelaAdicional).toBe(7336.60);
    });

    it("respeita teto de R$ 18.952,40 sem majoracao", () => {
      const result = calc.calculateExercicio(50000);
      // 50000 * 0.90 + 3532.92 = 48532.92 > teto
      expect(result.regraBasica).toBe(18952.40);
    });
  });

  describe("programa complementar", () => {
    it("retorna zero para Fenaban generico", () => {
      const result = calc.calculateProgramaComplementar(5000);
      expect(result.value).toBe(0);
      expect(result.name).toBeNull();
    });
  });

  describe("breakdown completo", () => {
    it("calcula 12 meses para salario de R$ 5.000", () => {
      const breakdown = calc.getBreakdown(5000, 12);
      expect(breakdown.regraBasicaAntecipacao).toBe(4819.75);
      expect(breakdown.parcelaAdicionalAntecipacao).toBe(3668.29);
      expect(breakdown.totalAntecipacao).toBe(8488.04);
      expect(breakdown.regraBasicaExercicio).toBe(8032.92);
      expect(breakdown.parcelaAdicionalExercicio).toBe(7336.60);
      expect(breakdown.totalExercicioSemDesconto).toBe(15369.52);
      expect(breakdown.descontoAntecipacao).toBe(8488.04);
      expect(breakdown.totalExercicio).toBe(6881.48);
      expect(breakdown.programaComplementar).toBe(0);
    });

    it("aplica proporcao para 6 meses", () => {
      const full = calc.getBreakdown(5000, 12);
      const half = calc.getBreakdown(5000, 6);
      expect(half.totalAntecipacao).toBeCloseTo(full.totalAntecipacao / 2, 0);
    });
  });
});

describe("FenabanCalculator (com majoracao)", () => {
  const calc = new FenabanCalculator(true);

  it("aplica majoracao: min(2.2 * salario, R$ 41.695,29)", () => {
    const result = calc.calculateExercicio(5000);
    // majorada: min(2.2 * 5000, 41695.29) = min(11000, 41695.29) = 11000
    // padrao:   min(0.9 * 5000 + 3532.92, 18952.40) = 8032.92
    // efetiva = max(8032.92, 11000) = 11000
    expect(result.regraBasica).toBe(11000);
  });

  it("majoracao respeita teto de R$ 41.695,29 para salarios altos", () => {
    const result = calc.calculateExercicio(25000);
    // majorada: min(2.2 * 25000, 41695.29) = min(55000, 41695.29) = 41695.29
    expect(result.regraBasica).toBe(41695.29);
  });

  it("antecipacao nao e afetada pela majoracao", () => {
    const semMajoracao = new FenabanCalculator(false);
    const comMajoracao = new FenabanCalculator(true);
    const sem = semMajoracao.calculateAntecipacao(5000);
    const com = comMajoracao.calculateAntecipacao(5000);
    expect(sem.regraBasica).toBe(com.regraBasica);
  });
});
