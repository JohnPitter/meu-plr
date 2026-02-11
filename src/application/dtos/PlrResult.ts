import type { PlrCalculation } from "../../domain/entities/PlrCalculation.ts";
import type { TaxResult } from "../../domain/interfaces/ITaxCalculator.ts";

export interface PlrResult {
  calculation: PlrCalculation;
  tax: TaxResult;
}
