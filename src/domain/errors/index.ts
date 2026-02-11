export class PlrError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlrError";
  }
}

export class InvalidSalaryError extends PlrError {
  constructor(value: number) {
    super(`Salario invalido: ${value}. Deve ser um numero positivo.`);
    this.name = "InvalidSalaryError";
  }
}

export class InvalidBankError extends PlrError {
  constructor(bankId: string) {
    super(`Banco nao suportado: ${bankId}`);
    this.name = "InvalidBankError";
  }
}

export class InvalidPeriodError extends PlrError {
  constructor(months: number) {
    super(`Periodo invalido: ${months}. Deve ser entre 1 e 12 meses.`);
    this.name = "InvalidPeriodError";
  }
}
