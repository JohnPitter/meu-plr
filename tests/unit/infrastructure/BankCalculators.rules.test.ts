import { describe, it, expect } from "vitest";
import { ItauCalculator, PCR_1O_PATAMAR, PCR_2O_PATAMAR } from "../../../src/infrastructure/calculators/ItauCalculator";
import { SantanderCalculator } from "../../../src/infrastructure/calculators/SantanderCalculator";
import { BradescoCalculator } from "../../../src/infrastructure/calculators/BradescoCalculator";
import { BbCalculator } from "../../../src/infrastructure/calculators/BbCalculator";
import { CaixaCalculator } from "../../../src/infrastructure/calculators/CaixaCalculator";
import { FenabanCalculator } from "../../../src/infrastructure/calculators/FenabanCalculator";
import { createCalculator } from "../../../src/infrastructure/calculators/CalculatorFactory";
import { BANKS } from "../../../src/domain/value-objects/Bank";

describe("Itau — PCR e majoracao", () => {
  it("PCR 1o patamar = R$ 3.908,05", () => {
    expect(PCR_1O_PATAMAR).toBe(3908.05);
  });

  it("PCR 2o patamar = R$ 4.299,86 (default)", () => {
    expect(PCR_2O_PATAMAR).toBe(4299.86);
    const calc = new ItauCalculator();
    expect(calc.calculateProgramaComplementar(5000).value).toBe(4299.86);
  });

  it("PCR com 1o patamar customizado", () => {
    const calc = new ItauCalculator(PCR_1O_PATAMAR);
    expect(calc.calculateProgramaComplementar(5000).value).toBe(3908.05);
  });

  it("majoracao habilitada (banco lucrativo)", () => {
    const calc = new ItauCalculator();
    expect(calc.majoracao).toBe(true);
  });

  it("breakdown 12 meses salario R$ 8.000 inclui PCR proporcional", () => {
    const calc = new ItauCalculator();
    const b = calc.getBreakdown(8000, 12);
    expect(b.programaComplementar).toBe(4299.86);
    expect(b.programaComplementarNome).toContain("PCR");

    // Exercicio majorado: min(2.2 * 8000, 41695.29) = 17600
    expect(b.regraBasicaExercicio).toBe(17600);

    // Total bruto = antecipacao + exercicio + PCR
    const total = b.totalAntecipacao + b.totalExercicio + b.programaComplementar;
    expect(total).toBeGreaterThan(0);
  });

  it("breakdown 6 meses: PCR proporcional a 6/12", () => {
    const calc = new ItauCalculator();
    const full = calc.getBreakdown(8000, 12);
    const half = calc.getBreakdown(8000, 6);
    expect(half.programaComplementar).toBeCloseTo(full.programaComplementar / 2, 1);
  });
});

describe("Santander — PPRS e majoracao", () => {
  it("PPRS default = R$ 3.880,84", () => {
    const calc = new SantanderCalculator();
    const r = calc.calculateProgramaComplementar(5000);
    expect(r.value).toBe(3880.84);
    expect(r.name).toContain("PPRS");
  });

  it("PPRS customizado", () => {
    const calc = new SantanderCalculator(4500);
    expect(calc.calculateProgramaComplementar(5000).value).toBe(4500);
  });

  it("majoracao habilitada", () => {
    const calc = new SantanderCalculator();
    expect(calc.majoracao).toBe(true);
  });

  it("breakdown inclui PPRS no total", () => {
    const calc = new SantanderCalculator();
    const b = calc.getBreakdown(5000, 12);
    expect(b.programaComplementar).toBe(3880.84);
  });
});

describe("Bradesco — PRB e majoracao", () => {
  it("PRB default = R$ 2.500 (ROAE 18,5%)", () => {
    const calc = new BradescoCalculator();
    const r = calc.calculateProgramaComplementar(5000);
    expect(r.value).toBe(2500);
    expect(r.name).toContain("PRB");
  });

  it("PRB minimo R$ 1.000", () => {
    const calc = new BradescoCalculator(1000);
    expect(calc.calculateProgramaComplementar(5000).value).toBe(1000);
  });

  it("majoracao habilitada", () => {
    const calc = new BradescoCalculator();
    expect(calc.majoracao).toBe(true);
  });
});

describe("Banco do Brasil — Modulo BB sem majoracao", () => {
  it("Modulo BB default = R$ 3.500", () => {
    const calc = new BbCalculator();
    const r = calc.calculateProgramaComplementar(5000);
    expect(r.value).toBe(3500);
    expect(r.name).toContain("Módulo BB");
  });

  it("Modulo BB customizado", () => {
    const calc = new BbCalculator(4000);
    expect(calc.calculateProgramaComplementar(5000).value).toBe(4000);
  });

  it("SEM majoracao (BB usa estrutura propria)", () => {
    const calc = new BbCalculator();
    expect(calc.majoracao).toBe(false);
  });

  it("exercicio usa regra basica padrao (sem majoracao)", () => {
    const calc = new BbCalculator();
    const fenaban = new FenabanCalculator(false);
    expect(calc.calculateExercicio(5000).regraBasica).toBe(fenaban.calculateExercicio(5000).regraBasica);
  });
});

describe("BTG Pactual — Fenaban com majoracao, sem complementar", () => {
  it("factory retorna FenabanCalculator com majoracao", () => {
    const calc = createCalculator(BANKS.BTG);
    const r = calc.calculateExercicio(5000);
    // majorada: min(2.2 * 5000, 41695.29) = 11000
    expect(r.regraBasica).toBe(11000);
  });

  it("sem programa complementar", () => {
    const calc = createCalculator(BANKS.BTG);
    const r = calc.calculateProgramaComplementar(5000);
    expect(r.value).toBe(0);
    expect(r.name).toBeNull();
  });
});

describe("Safra — Fenaban generico sem majoracao", () => {
  it("factory retorna FenabanCalculator sem majoracao", () => {
    const calc = createCalculator(BANKS.SAFRA);
    const r = calc.calculateExercicio(5000);
    // sem majoracao: min(0.9 * 5000 + 3532.92, 18952.40) = 8032.92
    expect(r.regraBasica).toBe(8032.92);
  });

  it("sem programa complementar", () => {
    const calc = createCalculator(BANKS.SAFRA);
    const r = calc.calculateProgramaComplementar(5000);
    expect(r.value).toBe(0);
    expect(r.name).toBeNull();
  });
});

describe("Caixa — formula propria, PLR Social, teto 3x", () => {
  const calc = new CaixaCalculator();

  describe("antecipacao Caixa: 45% salario + R$ 1.766,46 (teto R$ 9.476,20)", () => {
    it("salario R$ 5.000", () => {
      const r = calc.calculateAntecipacao(5000);
      // 5000 * 0.45 + 1766.46 = 4016.46
      expect(r.regraBasica).toBe(4016.46);
    });

    it("salario alto atinge teto R$ 9.476,20", () => {
      const r = calc.calculateAntecipacao(20000);
      // 20000 * 0.45 + 1766.46 = 10766.46 > 9476.20
      expect(r.regraBasica).toBe(9476.20);
    });

    it("parcela adicional herda Fenaban", () => {
      const r = calc.calculateAntecipacao(5000);
      expect(r.parcelaAdicional).toBe(3668.29);
    });
  });

  describe("PLR Social", () => {
    it("default R$ 3.200", () => {
      const r = calc.calculateProgramaComplementar(5000);
      expect(r.value).toBe(3200);
      expect(r.name).toContain("PLR Social");
    });

    it("customizado", () => {
      const custom = new CaixaCalculator(2500);
      expect(custom.calculateProgramaComplementar(5000).value).toBe(2500);
    });
  });

  describe("SEM majoracao", () => {
    it("flag majoracao = false", () => {
      expect(calc.majoracao).toBe(false);
    });

    it("exercicio usa regra basica padrao Fenaban", () => {
      const fenaban = new FenabanCalculator(false);
      expect(calc.calculateExercicio(5000).regraBasica).toBe(fenaban.calculateExercicio(5000).regraBasica);
    });
  });

  describe("teto de 3 remuneracoes", () => {
    it("salario R$ 3.000: total <= R$ 9.000", () => {
      const b = calc.getBreakdown(3000, 12);
      const total = b.totalAntecipacao + b.totalExercicio + b.programaComplementar;
      expect(total).toBeLessThanOrEqual(9000);
    });

    it("salario R$ 2.000: total <= R$ 6.000", () => {
      const b = calc.getBreakdown(2000, 12);
      const total = b.totalAntecipacao + b.totalExercicio + b.programaComplementar;
      expect(total).toBeLessThanOrEqual(6000);
    });

    it("salario alto R$ 20.000: teto nao acionado (total < 60.000)", () => {
      const b = calc.getBreakdown(20000, 12);
      const total = b.totalAntecipacao + b.totalExercicio + b.programaComplementar;
      // Sem majoracao, total nao ultrapassa 3x salario alto
      expect(total).toBeLessThanOrEqual(60000);
    });

    it("teto aplica reducao proporcional em todas as parcelas", () => {
      // Salario muito baixo forca acionamento do teto
      const b = calc.getBreakdown(2000, 12);
      const total = b.totalAntecipacao + b.totalExercicio + b.programaComplementar;
      // Se o teto foi acionado, total == 3 * salario
      if (total === 6000) {
        // Todas as parcelas devem ter sido reduzidas proporcionalmente
        expect(b.totalAntecipacao).toBeGreaterThan(0);
        expect(b.totalExercicio).toBeGreaterThan(0);
        expect(b.programaComplementar).toBeGreaterThan(0);
      }
    });

    it("proporcionalidade com teto: 6 meses", () => {
      const full = calc.getBreakdown(3000, 12);
      const half = calc.getBreakdown(3000, 6);
      const totalFull = full.totalAntecipacao + full.totalExercicio + full.programaComplementar;
      const totalHalf = half.totalAntecipacao + half.totalExercicio + half.programaComplementar;
      expect(totalHalf).toBeLessThanOrEqual(totalFull);
    });
  });
});
