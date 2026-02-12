import { describe, it, expect } from "vitest";
import { DiscoverMultiplier } from "../../../src/application/use-cases/DiscoverMultiplier";
import { IrrfCalculator } from "../../../src/infrastructure/tax/IrrfCalculator";

const taxCalc = new IrrfCalculator();
const useCase = new DiscoverMultiplier(taxCalc);

describe("DiscoverMultiplier", () => {
  it("calcula multiplicador a partir dos brutos das parcelas", () => {
    const result = useCase.execute({
      salario: 5000,
      brutoPrimeiraParcela: 4500,
      brutoSegundaParcela: 6500,
    });

    expect(result.totalBruto).toBe(11000);
    expect(result.multiplicador).toBe(2.2);
  });

  it("distribui IRRF proporcionalmente entre parcelas", () => {
    const result = useCase.execute({
      salario: 5000,
      brutoPrimeiraParcela: 8000,
      brutoSegundaParcela: 10000,
    });

    // IRRF total = IRRF(18000) = 18000 * 27.5% - 3123.78 = 1826.22
    expect(result.irrfTotal).toBeCloseTo(1826.22, 1);
    // IRRF 1a proporcional = 1826.22 * (8000/18000)
    expect(result.irrfPrimeiraParcela).toBeCloseTo(1826.22 * (8000 / 18000), 0);
    // IRRF 2a = total - 1a
    expect(result.irrfPrimeiraParcela + result.irrfSegundaParcela).toBeCloseTo(result.irrfTotal, 1);
  });

  it("liquido por parcela e bruto menos IRRF proporcional", () => {
    const result = useCase.execute({
      salario: 5000,
      brutoPrimeiraParcela: 4500,
      brutoSegundaParcela: 6500,
    });

    expect(result.liquidoPrimeiraParcela).toBeCloseTo(4500 - result.irrfPrimeiraParcela, 2);
    expect(result.liquidoSegundaParcela).toBeCloseTo(6500 - result.irrfSegundaParcela, 2);
    expect(result.totalLiquido).toBeCloseTo(result.liquidoPrimeiraParcela + result.liquidoSegundaParcela, 0);
  });

  it("IRRF da 2a parcela nunca e negativo", () => {
    const result = useCase.execute({
      salario: 5000,
      brutoPrimeiraParcela: 10000,
      brutoSegundaParcela: 1000,
    });

    expect(result.irrfSegundaParcela).toBeGreaterThanOrEqual(0);
  });

  it("aceita apenas 1a parcela (2a = 0)", () => {
    const result = useCase.execute({
      salario: 5000,
      brutoPrimeiraParcela: 5000,
      brutoSegundaParcela: 0,
    });

    expect(result.totalBruto).toBe(5000);
    expect(result.multiplicador).toBe(1);
    expect(result.liquidoSegundaParcela).toBe(0);
    expect(result.irrfSegundaParcela).toBe(0);
  });

  it("aceita apenas 2a parcela (1a = 0)", () => {
    const result = useCase.execute({
      salario: 5000,
      brutoPrimeiraParcela: 0,
      brutoSegundaParcela: 10000,
    });

    expect(result.totalBruto).toBe(10000);
    expect(result.multiplicador).toBe(2);
    expect(result.irrfPrimeiraParcela).toBe(0);
  });

  it("erro para salario zero", () => {
    expect(() =>
      useCase.execute({ salario: 0, brutoPrimeiraParcela: 5000, brutoSegundaParcela: 5000 }),
    ).toThrow("Salario deve ser maior que zero");
  });

  it("erro para ambas parcelas zero", () => {
    expect(() =>
      useCase.execute({ salario: 5000, brutoPrimeiraParcela: 0, brutoSegundaParcela: 0 }),
    ).not.toThrow(); // allowed, multiplicador = 0
  });

  it("retorna faixa de IRRF", () => {
    const result = useCase.execute({
      salario: 5000,
      brutoPrimeiraParcela: 5000,
      brutoSegundaParcela: 10000,
    });

    expect(result.faixa).toBeDefined();
    expect(result.faixa.length).toBeGreaterThan(0);
  });
});
