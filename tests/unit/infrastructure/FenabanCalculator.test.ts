import { describe, it, expect } from "vitest";
import { FenabanCalculator } from "../../../src/infrastructure/calculators/FenabanCalculator";

describe("FenabanCalculator", () => {
  const calc = new FenabanCalculator();

  describe("antecipacao", () => {
    it("calcula regra basica: 54% + R$ 1.517,72", () => {
      const result = calc.calculateAntecipacao(5000);
      // 5000 * 0.54 + 1517.72 = 4217.72
      expect(result.regraBasica).toBe(4217.72);
      expect(result.parcelaAdicional).toBe(2529.54);
    });

    it("respeita teto de R$ 8.141,83", () => {
      const result = calc.calculateAntecipacao(50000);
      // 50000 * 0.54 + 1517.72 = 28517.72 > teto
      expect(result.regraBasica).toBe(8141.83);
    });
  });

  describe("exercicio", () => {
    it("calcula regra basica: 90% + R$ 3.792,41", () => {
      const result = calc.calculateExercicio(5000);
      // 5000 * 0.90 + 3792.41 = 8292.41
      expect(result.regraBasica).toBe(8292.41);
      expect(result.parcelaAdicional).toBe(758.47);
    });

    it("respeita teto de R$ 18.098,98", () => {
      const result = calc.calculateExercicio(50000);
      // 50000 * 0.90 + 3792.41 = 48792.41 > teto
      expect(result.regraBasica).toBe(18098.98);
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
      expect(breakdown.regraBasicaAntecipacao).toBe(4217.72);
      expect(breakdown.parcelaAdicionalAntecipacao).toBe(2529.54);
      expect(breakdown.totalAntecipacao).toBe(6747.26);
      expect(breakdown.regraBasicaExercicio).toBe(8292.41);
      expect(breakdown.parcelaAdicionalExercicio).toBe(758.47);
      expect(breakdown.totalExercicioSemDesconto).toBe(9050.88);
      expect(breakdown.descontoAntecipacao).toBe(6747.26);
      expect(breakdown.totalExercicio).toBe(2303.62);
      expect(breakdown.programaComplementar).toBe(0);
    });

    it("aplica proporcao para 6 meses", () => {
      const full = calc.getBreakdown(5000, 12);
      const half = calc.getBreakdown(5000, 6);
      expect(half.totalAntecipacao).toBeCloseTo(full.totalAntecipacao / 2, 0);
    });
  });
});
