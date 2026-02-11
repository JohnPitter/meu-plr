import { useState, useCallback } from "react";
import { CalculatePlr } from "../../application/use-cases/CalculatePlr.ts";
import { createCalculator } from "../../infrastructure/calculators/CalculatorFactory.ts";
import { IrrfCalculator } from "../../infrastructure/tax/IrrfCalculator.ts";
import { ConsoleLogger } from "../../infrastructure/logging/ConsoleLogger.ts";
import type { PlrInput } from "../../application/dtos/PlrInput.ts";
import type { PlrResult } from "../../application/dtos/PlrResult.ts";

const logger = new ConsoleLogger();
const taxCalculator = new IrrfCalculator();
const useCase = new CalculatePlr(createCalculator, taxCalculator, logger);

export function usePlrCalculation() {
  const [result, setResult] = useState<PlrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((input: PlrInput): PlrResult | null => {
    try {
      setError(null);
      const plrResult = useCase.execute(input);
      setResult(plrResult);
      return plrResult;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro desconhecido";
      setError(message);
      setResult(null);
      logger.error("Erro no calculo PLR", { error: message });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, calculate, reset };
}
