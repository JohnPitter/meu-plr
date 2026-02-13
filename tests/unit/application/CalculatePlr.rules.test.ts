import { describe, it, expect } from "vitest";
import { CalculatePlr } from "../../../src/application/use-cases/CalculatePlr";
import { createCalculator } from "../../../src/infrastructure/calculators/CalculatorFactory";
import { IrrfCalculator } from "../../../src/infrastructure/tax/IrrfCalculator";
import { ConsoleLogger } from "../../../src/infrastructure/logging/ConsoleLogger";
import { BANKS, type BankId } from "../../../src/domain/value-objects/Bank";

const logger = new ConsoleLogger();
const taxCalc = new IrrfCalculator();
const useCase = new CalculatePlr(createCalculator, taxCalc, logger);

function calc(bankId: BankId, salario: number, meses = 12, sindical = false, valorPrimeiraParcela?: number) {
  return useCase.execute({ bankId, salario, mesesTrabalhados: meses, incluirContribuicaoSindical: sindical, valorPrimeiraParcela });
}

describe("CalculatePlr — regras de negocio completas", () => {
  describe("formula bruto: antecipacao + exercicio + complementar", () => {
    it("Safra 12m R$ 5.000: bruto = RB_ant + PA_ant + RB_exe + PA_exe - antecipacao", () => {
      const r = calc(BANKS.SAFRA, 5000);
      // Antecipacao: RB=4819.75 PA=3668.29 → total=8488.04
      // Exercicio: RB=8032.92 PA=7336.60 → sem_desc=15369.52 → -8488.04=6881.48
      // Complementar=0
      // Total bruto = 8488.04 + 6881.48 + 0 = 15369.52
      expect(r.calculation.totalBruto).toBeCloseTo(15369.52, 2);
    });

    it("Itau 12m R$ 8.000: bruto inclui majoracao + PCR", () => {
      const r = calc(BANKS.ITAU, 8000);
      const b = r.calculation.breakdown;
      // Antecipacao: RB = 8000*0.54+2119.75=6439.75 PA=3668.29 → 10108.04
      // Exercicio majorado: RB=min(2.2*8000,41695.29)=17600 PA=7336.60 → sem_desc=24936.60 → -10108.04=14828.56
      // PCR=4299.86
      // Total = 10108.04 + 14828.56 + 4299.86 = 29236.46
      expect(r.calculation.totalBruto).toBeCloseTo(29236.46, 2);
      expect(b.programaComplementar).toBe(4299.86);
    });

    it("Caixa 12m R$ 5.000: bruto com PLR Social (sujeito a teto 3x)", () => {
      const r = calc(BANKS.CAIXA, 5000);
      // PLR Social = 3200 mas teto de 3 remuneracoes (15000) reduz proporcionalmente
      expect(r.calculation.breakdown.programaComplementar).toBeGreaterThan(0);
      expect(r.calculation.breakdown.programaComplementar).toBeLessThanOrEqual(3200);
      expect(r.calculation.totalBruto).toBeLessThanOrEqual(15000); // teto 3x R$ 5.000
    });

    it("BB 12m R$ 5.000: bruto com Modulo BB, sem majoracao", () => {
      const r = calc(BANKS.BB, 5000);
      expect(r.calculation.breakdown.programaComplementar).toBe(3500);
      // Sem majoracao, regra basica exercicio = padrao
      expect(r.calculation.breakdown.regraBasicaExercicio).toBe(8032.92);
    });
  });

  describe("liquido = bruto - irrf - sindical", () => {
    it("sem sindical: liquido = bruto - irrf", () => {
      const r = calc(BANKS.SAFRA, 5000, 12, false);
      expect(r.calculation.totalLiquido).toBeCloseTo(
        r.calculation.totalBruto - r.calculation.irrf, 2,
      );
      expect(r.calculation.contribuicaoSindical).toBe(0);
    });

    it("com sindical: liquido = bruto - irrf - 1,5%", () => {
      const r = calc(BANKS.SAFRA, 5000, 12, true);
      const expectedSindical = Math.round(r.calculation.totalBruto * 0.015 * 100) / 100;
      expect(r.calculation.contribuicaoSindical).toBe(expectedSindical);
      expect(r.calculation.totalLiquido).toBeCloseTo(
        r.calculation.totalBruto - r.calculation.irrf - r.calculation.contribuicaoSindical, 2,
      );
    });
  });

  describe("contribuicao sindical = 1,5% do bruto", () => {
    it("cada banco calcula 1,5% corretamente", () => {
      for (const bankId of Object.values(BANKS)) {
        const r = calc(bankId, 5000, 12, true);
        const expected = Math.round(r.calculation.totalBruto * 0.015 * 100) / 100;
        expect(r.calculation.contribuicaoSindical).toBe(expected);
      }
    });

    it("desmarcar sindical zera a contribuicao", () => {
      for (const bankId of Object.values(BANKS)) {
        const r = calc(bankId, 5000, 12, false);
        expect(r.calculation.contribuicaoSindical).toBe(0);
      }
    });
  });

  describe("proporcionalidade por meses trabalhados", () => {
    it("6 meses = metade de 12 meses para bancos sem teto especial", () => {
      // Exclui Caixa pois o teto de 3 remuneracoes pode quebrar a linearidade
      const bancosSemTeto = [BANKS.ITAU, BANKS.SANTANDER, BANKS.BRADESCO, BANKS.BB, BANKS.BTG, BANKS.SAFRA];
      for (const bankId of bancosSemTeto) {
        const full = calc(bankId, 5000, 12);
        const half = calc(bankId, 5000, 6);
        expect(half.calculation.totalBruto).toBeCloseTo(full.calculation.totalBruto / 2, 0);
      }
    });

    it("Caixa: 6 meses <= 12 meses (teto 3x pode afetar proporcao)", () => {
      const full = calc(BANKS.CAIXA, 5000, 12);
      const half = calc(BANKS.CAIXA, 5000, 6);
      expect(half.calculation.totalBruto).toBeLessThanOrEqual(full.calculation.totalBruto);
    });

    it("1 mes = 1/12 de 12 meses", () => {
      const full = calc(BANKS.ITAU, 8000, 12);
      const one = calc(BANKS.ITAU, 8000, 1);
      expect(one.calculation.totalBruto).toBeCloseTo(full.calculation.totalBruto / 12, 0);
    });
  });

  describe("IRRF aplicado sobre o bruto total (tabela PLR)", () => {
    it("bruto isento: irrf = 0", () => {
      // Salario muito baixo com 1 mes para ficar abaixo de 7640.80
      const r = calc(BANKS.SAFRA, 3000, 1);
      // Bruto ~ 15369.52 / 12 = 1280.79 → isento
      expect(r.calculation.irrf).toBe(0);
      expect(r.tax.faixa).toBe("Isento");
    });

    it("bruto alto: faixa 27,5%", () => {
      const r = calc(BANKS.ITAU, 15000, 12);
      expect(r.tax.aliquota).toBe(0.275);
    });

    it("IRRF coerente com tabela", () => {
      const r = calc(BANKS.SAFRA, 5000, 12);
      // bruto = 15369.52 → faixa 22,5% (13167.01 a 16380.38)
      // IRRF = 15369.52 * 0.225 - 2304.76 = 1153.38
      expect(r.tax.aliquota).toBe(0.225);
      expect(r.calculation.irrf).toBeCloseTo(15369.52 * 0.225 - 2304.76, 1);
    });
  });

  describe("calculo por parcela (valor 1a informado)", () => {
    it("bruto 2a = total - 1a parcela", () => {
      const r = calc(BANKS.ITAU, 8000, 12, false, 12000);
      expect(r.calculation.brutoSegundaParcela).toBeCloseTo(
        r.calculation.totalBruto - 12000, 2,
      );
    });

    it("IRRF total = IRRF 1a + IRRF 2a", () => {
      const r = calc(BANKS.ITAU, 8000, 12, false, 12000);
      expect(r.calculation.irrfPrimeiraParcela + r.calculation.irrfSegundaParcela)
        .toBeCloseTo(r.calculation.irrf, 2);
    });

    it("IRRF 1a proporcional ao peso da 1a no total", () => {
      const valor1a = 10000;
      const r = calc(BANKS.ITAU, 8000, 12, false, valor1a);
      const proporcao = valor1a / r.calculation.totalBruto;
      expect(r.calculation.irrfPrimeiraParcela).toBeCloseTo(r.calculation.irrf * proporcao, 1);
    });

    it("IRRF 2a nunca negativo (1a parcela maior que antecipacao)", () => {
      const r = calc(BANKS.SAFRA, 3000, 12, false, 15000);
      expect(r.calculation.irrfSegundaParcela).toBeGreaterThanOrEqual(0);
    });

    it("liquido 2a = bruto 2a - irrf 2a (sem sindical)", () => {
      const r = calc(BANKS.ITAU, 8000, 12, false, 10000);
      expect(r.calculation.liquidoSegundaParcela).toBeCloseTo(
        r.calculation.brutoSegundaParcela - r.calculation.irrfSegundaParcela, 2,
      );
    });

    it("liquido 2a com sindical desconta 1,5% do bruto 2a", () => {
      const r = calc(BANKS.ITAU, 8000, 12, true, 10000);
      const sindical2a = Math.round(r.calculation.brutoSegundaParcela * 0.015 * 100) / 100;
      expect(r.calculation.liquidoSegundaParcela).toBeCloseTo(
        r.calculation.brutoSegundaParcela - r.calculation.irrfSegundaParcela - sindical2a, 2,
      );
    });

    it("sem 1a parcela: campos da 2a ficam zerados", () => {
      const r = calc(BANKS.ITAU, 8000, 12, false);
      expect(r.calculation.valorPrimeiraParcela).toBeNull();
      expect(r.calculation.brutoSegundaParcela).toBe(0);
      expect(r.calculation.irrfSegundaParcela).toBe(0);
      expect(r.calculation.liquidoSegundaParcela).toBe(0);
    });
  });

  describe("validacao de entrada", () => {
    it("rejeita salario zero", () => {
      expect(() => calc(BANKS.SAFRA, 0)).toThrow();
    });

    it("rejeita salario negativo", () => {
      expect(() => calc(BANKS.SAFRA, -1)).toThrow();
    });

    it("rejeita meses 0", () => {
      expect(() => calc(BANKS.SAFRA, 5000, 0)).toThrow();
    });

    it("rejeita meses 13", () => {
      expect(() => calc(BANKS.SAFRA, 5000, 13)).toThrow();
    });

    it("rejeita meses fracionado", () => {
      expect(() => calc(BANKS.SAFRA, 5000, 6.5)).toThrow();
    });

    it("rejeita NaN", () => {
      expect(() => calc(BANKS.SAFRA, NaN)).toThrow();
    });

    it("rejeita Infinity", () => {
      expect(() => calc(BANKS.SAFRA, Infinity)).toThrow();
    });
  });

  describe("todos os bancos retornam resultado valido", () => {
    const bancos = Object.values(BANKS);

    for (const bankId of bancos) {
      it(`${bankId}: totalBruto > 0, totalLiquido > 0, irrf >= 0`, () => {
        const r = calc(bankId, 5000, 12, false);
        expect(r.calculation.totalBruto).toBeGreaterThan(0);
        expect(r.calculation.totalLiquido).toBeGreaterThan(0);
        expect(r.calculation.irrf).toBeGreaterThanOrEqual(0);
        expect(r.calculation.totalLiquido).toBeLessThanOrEqual(r.calculation.totalBruto);
        expect(r.calculation.bankId).toBe(bankId);
        expect(r.calculation.bankName.length).toBeGreaterThan(0);
      });
    }
  });

  describe("ranking de bancos por bruto (12m, R$ 5.000, sem sindical)", () => {
    it("bancos com majoracao > bancos sem majoracao (mesmo salario)", () => {
      const itau = calc(BANKS.ITAU, 5000).calculation.totalBruto;
      const safra = calc(BANKS.SAFRA, 5000).calculation.totalBruto;
      expect(itau).toBeGreaterThan(safra);
    });

    it("banco com complementar > mesmo banco sem", () => {
      const bb = calc(BANKS.BB, 5000).calculation.totalBruto;
      const safra = calc(BANKS.SAFRA, 5000).calculation.totalBruto;
      // BB tem Modulo BB (3500) mas sem majoracao
      // Safra nao tem complementar e sem majoracao
      expect(bb).toBeGreaterThan(safra);
    });
  });
});
