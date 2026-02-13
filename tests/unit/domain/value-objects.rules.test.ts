import { describe, it, expect } from "vitest";
import { Salary } from "../../../src/domain/value-objects/Salary";
import { WorkPeriod } from "../../../src/domain/value-objects/WorkPeriod";
import { BANKS, getBankInfo, BANK_LIST } from "../../../src/domain/value-objects/Bank";
import { InvalidSalaryError, InvalidPeriodError } from "../../../src/domain/errors";

describe("Salary — edge cases", () => {
  it("rejeita Infinity", () => {
    expect(() => new Salary(Infinity)).toThrow(InvalidSalaryError);
  });

  it("rejeita -Infinity", () => {
    expect(() => new Salary(-Infinity)).toThrow(InvalidSalaryError);
  });

  it("salario minimo bancario R$ 3.378,83 e valido", () => {
    const s = new Salary(3378.83);
    expect(s.value).toBe(3378.83);
  });

  it("centavos arredondados corretamente", () => {
    expect(new Salary(1000.005).value).toBe(1000.01);
    expect(new Salary(1000.004).value).toBe(1000.00);
  });

  it("salario muito alto e valido", () => {
    const s = new Salary(100000);
    expect(s.value).toBe(100000);
  });

  it("salario fracionado e valido", () => {
    const s = new Salary(5000.50);
    expect(s.value).toBe(5000.50);
  });
});

describe("WorkPeriod — edge cases", () => {
  it("1 mes: proporção = 1/12", () => {
    const p = new WorkPeriod(1);
    expect(p.proportion).toBeCloseTo(1 / 12, 10);
    expect(p.isFullYear).toBe(false);
  });

  it("11 meses: proporção = 11/12", () => {
    const p = new WorkPeriod(11);
    expect(p.proportion).toBeCloseTo(11 / 12, 10);
    expect(p.isFullYear).toBe(false);
  });

  it("todos os meses validos de 1 a 12", () => {
    for (let m = 1; m <= 12; m++) {
      const p = new WorkPeriod(m);
      expect(p.months).toBe(m);
      expect(p.proportion).toBeCloseTo(m / 12, 10);
    }
  });

  it("rejeita -1", () => {
    expect(() => new WorkPeriod(-1)).toThrow(InvalidPeriodError);
  });

  it("rejeita NaN", () => {
    expect(() => new WorkPeriod(NaN)).toThrow(InvalidPeriodError);
  });
});

describe("Bank — catalogo completo", () => {
  it("7 bancos cadastrados em ordem alfabetica", () => {
    expect(BANK_LIST).toHaveLength(7);
    const nomes = BANK_LIST.map((b) => b.name);
    const sorted = [...nomes].sort((a, b) => a.localeCompare(b, "pt-BR"));
    expect(nomes).toEqual(sorted);
  });

  it("todos os BANKS tem entrada no BANK_LIST", () => {
    for (const bankId of Object.values(BANKS)) {
      const info = getBankInfo(bankId);
      expect(info.id).toBe(bankId);
      expect(info.name.length).toBeGreaterThan(0);
    }
  });

  it("bancos com programa complementar tem nome definido", () => {
    for (const bank of BANK_LIST) {
      if (bank.hasAdditionalProgram) {
        expect(bank.additionalProgramName).toBeDefined();
        expect(bank.additionalProgramName!.length).toBeGreaterThan(0);
      }
    }
  });

  it("bancos sem programa complementar nao tem nome", () => {
    for (const bank of BANK_LIST) {
      if (!bank.hasAdditionalProgram) {
        expect(bank.additionalProgramName).toBeUndefined();
      }
    }
  });

  it("Itau, Santander, Bradesco, BB, Caixa tem programa complementar", () => {
    expect(getBankInfo(BANKS.ITAU).hasAdditionalProgram).toBe(true);
    expect(getBankInfo(BANKS.SANTANDER).hasAdditionalProgram).toBe(true);
    expect(getBankInfo(BANKS.BRADESCO).hasAdditionalProgram).toBe(true);
    expect(getBankInfo(BANKS.BB).hasAdditionalProgram).toBe(true);
    expect(getBankInfo(BANKS.CAIXA).hasAdditionalProgram).toBe(true);
  });

  it("BTG e Safra NAO tem programa complementar", () => {
    expect(getBankInfo(BANKS.BTG).hasAdditionalProgram).toBe(false);
    expect(getBankInfo(BANKS.SAFRA).hasAdditionalProgram).toBe(false);
  });

  it("nomes corretos dos programas", () => {
    expect(getBankInfo(BANKS.ITAU).additionalProgramName).toBe("PCR");
    expect(getBankInfo(BANKS.SANTANDER).additionalProgramName).toBe("PPRS");
    expect(getBankInfo(BANKS.BRADESCO).additionalProgramName).toBe("PRB");
    expect(getBankInfo(BANKS.BB).additionalProgramName).toBe("Módulo BB");
    expect(getBankInfo(BANKS.CAIXA).additionalProgramName).toBe("PLR Social");
  });
});
