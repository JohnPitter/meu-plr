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
      parcela: "total",
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
      parcela: "total",
    });

    const comSindical = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: true,
      parcela: "total",
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
      parcela: "total",
    });

    const safra = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: false,
      parcela: "total",
    });

    expect(itau.calculation.totalBruto).toBeGreaterThan(safra.calculation.totalBruto);
  });

  it("proporcional 6 meses e menor que 12 meses", () => {
    const full = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: false,
      parcela: "total",
    });

    const half = useCase.execute({
      bankId: BANKS.SAFRA,
      salario: 5000,
      mesesTrabalhados: 6,
      incluirContribuicaoSindical: false,
      parcela: "total",
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
      parcela: "total",
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
        parcela: "total",
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
        parcela: "total",
      }),
    ).toThrow();
  });

  describe("selecao de parcela", () => {
    const input = {
      bankId: BANKS.ITAU as const,
      salario: 8000,
      mesesTrabalhados: 12,
      incluirContribuicaoSindical: false,
    };

    it("1a parcela retorna apenas antecipacao como bruto", () => {
      const result = useCase.execute({ ...input, parcela: "primeira" as const });

      expect(result.calculation.parcela).toBe("primeira");
      expect(result.calculation.totalBruto).toBe(result.calculation.breakdown.totalAntecipacao);
    });

    it("2a parcela retorna exercicio + programa como bruto", () => {
      const result = useCase.execute({ ...input, parcela: "segunda" as const });
      const expectedBruto = result.calculation.breakdown.totalExercicio + result.calculation.breakdown.programaComplementar;

      expect(result.calculation.parcela).toBe("segunda");
      expect(result.calculation.totalBruto).toBe(expectedBruto);
    });

    it("total retorna soma de tudo como bruto", () => {
      const result = useCase.execute({ ...input, parcela: "total" as const });
      const breakdown = result.calculation.breakdown;
      const expectedBruto = breakdown.totalAntecipacao + breakdown.totalExercicio + breakdown.programaComplementar;

      expect(result.calculation.parcela).toBe("total");
      expect(result.calculation.totalBruto).toBe(expectedBruto);
    });

    it("soma dos brutos 1a + 2a = total", () => {
      const primeira = useCase.execute({ ...input, parcela: "primeira" as const });
      const segunda = useCase.execute({ ...input, parcela: "segunda" as const });
      const total = useCase.execute({ ...input, parcela: "total" as const });

      expect(primeira.calculation.totalBruto + segunda.calculation.totalBruto)
        .toBeCloseTo(total.calculation.totalBruto, 2);
    });

    it("IRRF da 2a parcela = IRRF(total) - IRRF(1a)", () => {
      const primeira = useCase.execute({ ...input, parcela: "primeira" as const });
      const segunda = useCase.execute({ ...input, parcela: "segunda" as const });
      const total = useCase.execute({ ...input, parcela: "total" as const });

      expect(primeira.calculation.irrf + segunda.calculation.irrf)
        .toBeCloseTo(total.calculation.irrf, 2);
    });

    it("liquido da 1a + 2a = liquido total (sem sindical)", () => {
      const primeira = useCase.execute({ ...input, parcela: "primeira" as const });
      const segunda = useCase.execute({ ...input, parcela: "segunda" as const });
      const total = useCase.execute({ ...input, parcela: "total" as const });

      expect(primeira.calculation.totalLiquido + segunda.calculation.totalLiquido)
        .toBeCloseTo(total.calculation.totalLiquido, 2);
    });

    it("1a parcela tem IRRF menor que o total", () => {
      const primeira = useCase.execute({ ...input, parcela: "primeira" as const });
      const total = useCase.execute({ ...input, parcela: "total" as const });

      expect(primeira.calculation.irrf).toBeLessThan(total.calculation.irrf);
    });
  });
});
