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
});
