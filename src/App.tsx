import { AlertCircle } from "lucide-react";
import { Layout } from "./presentation/components/Layout.tsx";
import { PlrForm } from "./presentation/components/PlrForm.tsx";
import { PlrResult } from "./presentation/components/PlrResult.tsx";
import { PlrBreakdown } from "./presentation/components/PlrBreakdown.tsx";
import { TaxTable } from "./presentation/components/TaxTable.tsx";
import { CalculationHistory } from "./presentation/components/CalculationHistory.tsx";
import { usePlrCalculation } from "./presentation/hooks/usePlrCalculation.ts";
import { useHistory } from "./presentation/hooks/useHistory.ts";
import { Card, CardContent } from "./presentation/components/ui/card.tsx";
import type { PlrInput } from "./application/dtos/PlrInput.ts";

export function App() {
  const { result, error, calculate } = usePlrCalculation();
  const { history, addEntry, removeEntry, clearHistory } = useHistory();

  function handleCalculate(input: PlrInput) {
    const plrResult = calculate(input);
    if (plrResult) {
      addEntry({
        bankId: plrResult.calculation.bankId,
        bankName: plrResult.calculation.bankName,
        salario: plrResult.calculation.salario,
        meses: plrResult.calculation.mesesTrabalhados,
        totalBruto: plrResult.calculation.totalBruto,
        totalLiquido: plrResult.calculation.totalLiquido,
      });
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Calculadora PLR</h1>
          <p className="text-muted-foreground">
            Simule sua Participacao nos Lucros e Resultados
          </p>
        </div>

        <PlrForm onSubmit={handleCalculate} />

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <>
            <PlrResult result={result} />
            <PlrBreakdown breakdown={result.calculation.breakdown} />
          </>
        )}

        <TaxTable />

        <CalculationHistory
          entries={history}
          onRemove={removeEntry}
          onClear={clearHistory}
        />
      </div>
    </Layout>
  );
}
