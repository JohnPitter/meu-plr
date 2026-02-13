import { describe, it, expect } from "vitest";
import { FenabanCalculator } from "../../../src/infrastructure/calculators/FenabanCalculator";

describe("FenabanCalculator — constantes CCT FENABAN 2024/2026 (reajuste 5,68%)", () => {
  const semMaj = new FenabanCalculator(false);
  const comMaj = new FenabanCalculator(true);

  describe("antecipacao: 54% do salario + R$ 2.119,75 (teto R$ 11.371,44)", () => {
    it("salario minimo bancario R$ 3.378,83", () => {
      const r = semMaj.calculateAntecipacao(3378.83);
      // 3378.83 * 0.54 + 2119.75 = 1824.5682 + 2119.75 = 3944.32
      expect(r.regraBasica).toBeCloseTo(3944.32, 2);
      expect(r.parcelaAdicional).toBe(3668.29);
    });

    it("salario R$ 10.000", () => {
      const r = semMaj.calculateAntecipacao(10000);
      // 10000 * 0.54 + 2119.75 = 7519.75
      expect(r.regraBasica).toBe(7519.75);
    });

    it("salario alto atinge teto R$ 11.371,44", () => {
      const r = semMaj.calculateAntecipacao(20000);
      // 20000 * 0.54 + 2119.75 = 12919.75 > 11371.44
      expect(r.regraBasica).toBe(11371.44);
    });

    it("salario exatamente no teto", () => {
      // Salario que gera exatamente o teto: (11371.44 - 2119.75) / 0.54 = 17132.76
      const salarioTeto = (11371.44 - 2119.75) / 0.54;
      const r = semMaj.calculateAntecipacao(salarioTeto);
      expect(r.regraBasica).toBeCloseTo(11371.44, 2);
    });

    it("majoracao NAO afeta antecipacao", () => {
      const sem = semMaj.calculateAntecipacao(8000);
      const com = comMaj.calculateAntecipacao(8000);
      expect(sem.regraBasica).toBe(com.regraBasica);
      expect(sem.parcelaAdicional).toBe(com.parcelaAdicional);
    });
  });

  describe("exercicio: 90% do salario + R$ 3.532,92 (teto R$ 18.952,40)", () => {
    it("salario R$ 5.000", () => {
      const r = semMaj.calculateExercicio(5000);
      // 5000 * 0.90 + 3532.92 = 8032.92
      expect(r.regraBasica).toBe(8032.92);
      expect(r.parcelaAdicional).toBe(7336.60);
    });

    it("salario alto atinge teto R$ 18.952,40", () => {
      const r = semMaj.calculateExercicio(20000);
      // 20000 * 0.90 + 3532.92 = 21532.92 > 18952.40
      expect(r.regraBasica).toBe(18952.40);
    });
  });

  describe("majoracao: min(2,2 x salario, R$ 41.695,29)", () => {
    it("salario R$ 5.000: majorada 11.000 > padrao 8.032,92", () => {
      const r = comMaj.calculateExercicio(5000);
      // majorada = min(2.2 * 5000, 41695.29) = 11000
      // padrao = min(0.9 * 5000 + 3532.92, 18952.40) = 8032.92
      // efetiva = max(8032.92, 11000) = 11000
      expect(r.regraBasica).toBe(11000);
    });

    it("salario R$ 15.000: majorada 33.000 > padrao 17.032,92", () => {
      const r = comMaj.calculateExercicio(15000);
      expect(r.regraBasica).toBe(33000);
    });

    it("salario R$ 20.000: majorada 41.695,29 (teto majoracao)", () => {
      const r = comMaj.calculateExercicio(20000);
      // majorada = min(2.2 * 20000, 41695.29) = min(44000, 41695.29) = 41695.29
      expect(r.regraBasica).toBe(41695.29);
    });

    it("salario baixo R$ 3.000: padrao > majorada, usa padrao", () => {
      const padrao = semMaj.calculateExercicio(3000);
      const majorada = comMaj.calculateExercicio(3000);
      // padrao = min(0.9 * 3000 + 3532.92, 18952.40) = 6232.92
      // majorada_calc = min(2.2 * 3000, 41695.29) = 6600
      // max(6232.92, 6600) = 6600
      expect(majorada.regraBasica).toBe(6600);
      expect(majorada.regraBasica).toBeGreaterThan(padrao.regraBasica);
    });
  });

  describe("parcela adicional: 2,2% do lucro liquido (teto fixo)", () => {
    it("antecipacao: teto R$ 3.668,29 independe do salario", () => {
      expect(semMaj.calculateAntecipacao(3000).parcelaAdicional).toBe(3668.29);
      expect(semMaj.calculateAntecipacao(50000).parcelaAdicional).toBe(3668.29);
    });

    it("exercicio: teto R$ 7.336,60 independe do salario", () => {
      expect(semMaj.calculateExercicio(3000).parcelaAdicional).toBe(7336.60);
      expect(semMaj.calculateExercicio(50000).parcelaAdicional).toBe(7336.60);
    });
  });

  describe("breakdown: composicao total = antecipacao + exercicio + complementar", () => {
    it("12 meses proporcao 1.0", () => {
      const b = semMaj.getBreakdown(5000, 12);
      expect(b.totalAntecipacao).toBe(
        Math.round((b.regraBasicaAntecipacao + b.parcelaAdicionalAntecipacao) * 100) / 100,
      );
      expect(b.totalExercicioSemDesconto).toBe(
        Math.round((b.regraBasicaExercicio + b.parcelaAdicionalExercicio) * 100) / 100,
      );
      expect(b.descontoAntecipacao).toBe(b.totalAntecipacao);
      expect(b.totalExercicio).toBe(
        Math.round((b.totalExercicioSemDesconto - b.descontoAntecipacao) * 100) / 100,
      );
    });

    it("proporcionalidade exata: 1 mes = 1/12 de 12 meses", () => {
      const full = semMaj.getBreakdown(5000, 12);
      const one = semMaj.getBreakdown(5000, 1);
      expect(one.totalAntecipacao).toBeCloseTo(full.totalAntecipacao / 12, 1);
    });

    it("proporcionalidade: cada mes de 1 a 12", () => {
      const full = semMaj.getBreakdown(8000, 12);
      for (let m = 1; m <= 12; m++) {
        const partial = semMaj.getBreakdown(8000, m);
        const total = partial.totalAntecipacao + partial.totalExercicio + partial.programaComplementar;
        const expected = (full.totalAntecipacao + full.totalExercicio + full.programaComplementar) * (m / 12);
        expect(total).toBeCloseTo(expected, 0);
      }
    });

    it("programa complementar generico = 0", () => {
      const b = semMaj.getBreakdown(5000, 12);
      expect(b.programaComplementar).toBe(0);
      expect(b.programaComplementarNome).toBeNull();
    });
  });
});
