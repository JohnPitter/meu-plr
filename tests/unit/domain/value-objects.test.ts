import { describe, it, expect } from "vitest";
import { Salary } from "../../../src/domain/value-objects/Salary";
import { WorkPeriod } from "../../../src/domain/value-objects/WorkPeriod";
import { BANKS, getBankInfo, BANK_LIST } from "../../../src/domain/value-objects/Bank";
import { InvalidSalaryError, InvalidPeriodError } from "../../../src/domain/errors";

describe("Salary", () => {
  it("cria salario valido", () => {
    const salary = new Salary(5000);
    expect(salary.value).toBe(5000);
  });

  it("arredonda para 2 casas decimais", () => {
    const salary = new Salary(5000.555);
    expect(salary.value).toBe(5000.56);
  });

  it("rejeita salario zero", () => {
    expect(() => new Salary(0)).toThrow(InvalidSalaryError);
  });

  it("rejeita salario negativo", () => {
    expect(() => new Salary(-1000)).toThrow(InvalidSalaryError);
  });

  it("rejeita NaN", () => {
    expect(() => new Salary(NaN)).toThrow(InvalidSalaryError);
  });
});

describe("WorkPeriod", () => {
  it("cria periodo de 12 meses", () => {
    const period = new WorkPeriod(12);
    expect(period.months).toBe(12);
    expect(period.proportion).toBe(1);
    expect(period.isFullYear).toBe(true);
  });

  it("calcula proporcao para 6 meses", () => {
    const period = new WorkPeriod(6);
    expect(period.proportion).toBe(0.5);
    expect(period.isFullYear).toBe(false);
  });

  it("rejeita 0 meses", () => {
    expect(() => new WorkPeriod(0)).toThrow(InvalidPeriodError);
  });

  it("rejeita 13 meses", () => {
    expect(() => new WorkPeriod(13)).toThrow(InvalidPeriodError);
  });

  it("rejeita fracao", () => {
    expect(() => new WorkPeriod(6.5)).toThrow(InvalidPeriodError);
  });
});

describe("Bank", () => {
  it("lista 6 bancos", () => {
    expect(BANK_LIST).toHaveLength(6);
  });

  it("retorna info do Itau", () => {
    const bank = getBankInfo(BANKS.ITAU);
    expect(bank.name).toBe("Itau Unibanco");
    expect(bank.hasAdditionalProgram).toBe(true);
    expect(bank.additionalProgramName).toBe("PCR");
  });

  it("retorna info do Safra", () => {
    const bank = getBankInfo(BANKS.SAFRA);
    expect(bank.hasAdditionalProgram).toBe(false);
  });

  it("erro para banco invalido", () => {
    expect(() => getBankInfo("inexistente" as never)).toThrow();
  });
});
