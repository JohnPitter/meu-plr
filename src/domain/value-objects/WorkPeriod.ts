import { InvalidPeriodError } from "../errors/index.ts";

export class WorkPeriod {
  readonly months: number;

  constructor(months: number) {
    if (!Number.isInteger(months) || months < 1 || months > 12) {
      throw new InvalidPeriodError(months);
    }
    this.months = months;
  }

  get proportion(): number {
    return this.months / 12;
  }

  get isFullYear(): boolean {
    return this.months === 12;
  }
}
