import { describe, it, expect } from "vitest";
import { DiscoverMultiplier } from "../../../src/application/use-cases/DiscoverMultiplier";
import { IrrfCalculator } from "../../../src/infrastructure/tax/IrrfCalculator";

const taxCalc = new IrrfCalculator();
const useCase = new DiscoverMultiplier(taxCalc);

describe("DiscoverMultiplier — regras de negocio", () => {
  describe("multiplicador = totalBruto / salario (arredondado 1 casa)", () => {
    it("R$ 11.000 / R$ 5.000 = 2,2x", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 4500, brutoSegundaParcela: 6500 });
      expect(r.multiplicador).toBe(2.2);
    });

    it("R$ 5.000 / R$ 5.000 = 1,0x", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 2000, brutoSegundaParcela: 3000 });
      expect(r.multiplicador).toBe(1);
    });

    it("R$ 15.000 / R$ 5.000 = 3,0x", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 6000, brutoSegundaParcela: 9000 });
      expect(r.multiplicador).toBe(3);
    });

    it("arredondamento: R$ 11.500 / R$ 5.000 = 2,3x", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 5000, brutoSegundaParcela: 6500 });
      expect(r.multiplicador).toBe(2.3);
    });
  });

  describe("IRRF distribuido proporcionalmente entre parcelas", () => {
    it("parcelas iguais: IRRF dividido igualmente", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 5000, brutoSegundaParcela: 5000 });
      expect(r.irrfPrimeiraParcela).toBeCloseTo(r.irrfSegundaParcela, 1);
    });

    it("1a parcela 100% do bruto: todo IRRF na 1a", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 10000, brutoSegundaParcela: 0 });
      expect(r.irrfPrimeiraParcela).toBeCloseTo(r.irrfTotal, 2);
      expect(r.irrfSegundaParcela).toBe(0);
    });

    it("2a parcela 100% do bruto: todo IRRF na 2a", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 0, brutoSegundaParcela: 10000 });
      expect(r.irrfPrimeiraParcela).toBe(0);
      expect(r.irrfSegundaParcela).toBeCloseTo(r.irrfTotal, 2);
    });

    it("IRRF total = IRRF 1a + IRRF 2a", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 8000, brutoSegundaParcela: 12000 });
      expect(r.irrfPrimeiraParcela + r.irrfSegundaParcela).toBeCloseTo(r.irrfTotal, 1);
    });
  });

  describe("liquido por parcela = bruto - IRRF proporcional", () => {
    it("liquido 1a + liquido 2a = total liquido", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 4500, brutoSegundaParcela: 6500 });
      expect(r.liquidoPrimeiraParcela + r.liquidoSegundaParcela).toBeCloseTo(r.totalLiquido, 0);
    });

    it("total liquido = total bruto - irrf total", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 5000, brutoSegundaParcela: 8000 });
      expect(r.totalLiquido).toBeCloseTo(r.totalBruto - r.irrfTotal, 0);
    });
  });

  describe("validacao de entrada", () => {
    it("erro para salario zero", () => {
      expect(() => useCase.execute({ salario: 0, brutoPrimeiraParcela: 5000, brutoSegundaParcela: 5000 }))
        .toThrow("Salario deve ser maior que zero");
    });

    it("erro para salario negativo", () => {
      expect(() => useCase.execute({ salario: -1, brutoPrimeiraParcela: 5000, brutoSegundaParcela: 5000 }))
        .toThrow("Salario deve ser maior que zero");
    });

    it("erro para bruto 1a negativo", () => {
      expect(() => useCase.execute({ salario: 5000, brutoPrimeiraParcela: -1, brutoSegundaParcela: 5000 }))
        .toThrow("Bruto da 1a parcela invalido");
    });

    it("erro para bruto 2a negativo", () => {
      expect(() => useCase.execute({ salario: 5000, brutoPrimeiraParcela: 5000, brutoSegundaParcela: -1 }))
        .toThrow("Bruto da 2a parcela invalido");
    });

    it("ambas parcelas zero: multiplicador = 0, sem erro", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 0, brutoSegundaParcela: 0 });
      expect(r.multiplicador).toBe(0);
      expect(r.totalBruto).toBe(0);
      expect(r.irrfTotal).toBe(0);
    });
  });

  describe("faixa de IRRF", () => {
    it("bruto isento retorna faixa Isento", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 3000, brutoSegundaParcela: 2000 });
      // total = 5000, isento
      expect(r.faixa).toBe("Isento");
    });

    it("bruto alto retorna faixa 27,5%", () => {
      const r = useCase.execute({ salario: 5000, brutoPrimeiraParcela: 10000, brutoSegundaParcela: 15000 });
      expect(r.faixa).toBe("27,5%");
    });
  });
});
