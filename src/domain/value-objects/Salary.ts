import { InvalidSalaryError } from "../errors/index.ts";

export class Salary {
  readonly value: number;

  constructor(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new InvalidSalaryError(value);
    }
    this.value = Math.round(value * 100) / 100;
  }
}
