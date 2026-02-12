import { describe, it, expect } from "vitest";
import { CalculatePlr } from "../../../src/application/use-cases/CalculatePlr";
import { createCalculator } from "../../../src/infrastructure/calculators/CalculatorFactory";
import { IrrfCalculator } from "../../../src/infrastructure/tax/IrrfCalculator";
import { ConsoleLogger } from "../../../src/infrastructure/logging/ConsoleLogger";
import { BANKS } from "../../../src/domain/value-objects/Bank";

const logger = new ConsoleLogger();
const taxCalc = new IrrfCalculator();
const useCase = new CalculatePlr(createCalculator, taxCalc, logger);

describe("CalculatePlr", () => {
  it("calcula PLR Safra (Fenaban generico) para 12 meses", () => {
    const result = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: false,
    });

    expect(result.calculation.bankName).toBe("Banco Safra");
    expect(result.calculation.totalBruto).toBeGreaterThan(0);
    expect(result.calculation.irrf).toBeGreaterThanOrEqual(0);
    expect(result.calculation.totalLiquido).toBeLessThanOrEqual(result.calculation.totalBruto);
    expect(result.calculation.contribuicaoSindical).toBe(0);
  });

  it("desconta contribuicao sindical de 1,5%", () => {
    const semSindical = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: false,
    });

    const comSindical = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: true,
    });

    expect(comSindical.calculation.contribuicaoSindical).toBeGreaterThan(0);
    const expectedSindical = Math.round(semSindical.calculation.totalBruto * 0.015 * 100) / 100;
    expect(comSindical.calculation.contribuicaoSindical).toBe(expectedSindical);
    expect(comSindical.calculation.totalLiquido).toBeLessThan(semSindical.calculation.totalLiquido);
  });

  it("Itau tem valor maior que Safra (por causa do PCR)", () => {
    const itau = useCase.execute({
      bankId: BANKS.ITAU,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: false,
    });

    const safra = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: false,
    });

    expect(itau.calculation.totalBruto).toBeGreaterThan(safra.calculation.totalBruto);
  });

  it("proporcional 6 meses e menor que 12 meses", () => {
    const full = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: false,
    });

    const half = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 6,
      incluirContribuicaoSindical: false,
    });

    expect(half.calculation.totalBruto).toBeLessThan(full.calculation.totalBruto);
    expect(half.calculation.totalBruto).toBeCloseTo(full.calculation.totalBruto / 2, 0);
  });

  it("retorna faixa de IRRF correta", () => {
    const result = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: false,
    });

    expect(result.tax.faixa).toBeDefined();
    expect(result.tax.aliquota).toBeGreaterThanOrEqual(0);
  });

  it("rejeita salario invalido", () => {
    expect(() =>
      useCase.execute({
        bankId: BANKS.SAFRA,
        salario: -1000,
        mesesTrabalhados: 12,
        incluirContribuicaoSindical: false,
      }),
    ).toThrow();
  });

  it("rejeita meses invalido", () => {
    expect(() =>
      useCase.execute({
        bankId: BANKS.SAFRA,
        salario: 5000,
        mesesTrabalhados: 0,
        incluirContribuicaoSindical: false,
      }),
    ).toThrow();
  });

  describe("valor da 1a parcela informado", () => {
    it("sem valor da 1a parcela, campos da 2a ficam zerados", () => {
      const result = useCase.execute({
        bankId: BANKS.ITAU,
        salario: 8000,
        mesesTrabalhados: 12,
        incluirContribuicaoSindical: false,
      });

      expect(result.calculation.valorPrimeiraParcela).toBeNull();
      expect(result.calculation.brutoSegundaParcela).toBe(0);
      expect(result.calculation.irrfSegundaParcela).toBe(0);
      expect(result.calculation.liquidoSegundaParcela).toBe(0);
    });

    it("com valor da 1a parcela, calcula bruto da 2a como total - 1a", () => {
      const valor1a = 10000;
      const result = useCase.execute({
        bankId: BANKS.ITAU,
        salario: 8000,
        mesesTrabalhados: 12,
        incluirContribuicaoSindical: false,
        valorPrimeiraParcela: valor1a,
      });

      expect(result.calculation.valorPrimeiraParcela).toBe(valor1a);
      expect(result.calculation.brutoSegundaParcela).toBeCloseTo(
        result.calculation.totalBruto - valor1a, 2,
      );
    });

    it("IRRF da 2a = IRRF(total) - IRRF(1a parcela informada)", () => {
      const valor1a = 10000;
      const result = useCase.execute({
        bankId: BANKS.ITAU,
        salario: 8000,
        mesesTrabalhados: 12,
        incluirContribuicaoSindical: false,
        valorPrimeiraParcela: valor1a,
      });

      const irrfTotal = result.calculation.irrf;
      const irrf1a = result.calculation.irrfPrimeiraParcela;
      const irrf2a = result.calculation.irrfSegundaParcela;

      expect(irrf1a + irrf2a).toBeCloseTo(irrfTotal, 2);
    });

    it("liquido da 2a parcela e bruto - irrf diferencial", () => {
      const valor1a = 10000;
      const result = useCase.execute({
        bankId: BANKS.ITAU,
        salario: 8000,
        mesesTrabalhados: 12,
        incluirContribuicaoSindical: false,
        valorPrimeiraParcela: valor1a,
      });

      expect(result.calculation.liquidoSegundaParcela).toBeCloseTo(
        result.calculation.brutoSegundaParcela - result.calculation.irrfSegundaParcela, 2,
      );
    });

    it("IRRF da 2a parcela nunca e negativo", () => {
      // Caso extremo: valor da 1a parcela maior que a antecipacao calculada
      const result = useCase.execute({
        bankId: BANKS.SAFRA,
        salario: 3000,
        mesesTrabalhados: 12,
        incluirContribuicaoSindical: false,
        valorPrimeiraParcela: 15000,
      });

      expect(result.calculation.irrfSegundaParcela).toBeGreaterThanOrEqual(0);
    });
  });
});
