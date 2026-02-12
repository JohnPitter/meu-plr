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
import type { BankId } from "./domain/value-objects/Bank.ts";

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
        parcela: plrResult.calculation.parcela,
        totalBruto: plrResult.calculation.totalBruto,
        totalLiquido: plrResult.calculation.totalLiquido,
      });
    }
  }

  function handleHistorySelect(entry: { bankId: string; salario: number; meses: number; parcela?: string }) {
    handleCalculate({
      bankId: entry.bankId as BankId,
      salario: entry.salario,
      mesesTrabalhados: entry.meses,
      incluirContribuicaoSindical: true,
      parcela: (entry.parcela as "total" | "primeira" | "segunda") ?? "total",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Calculadora PLR</h1>
          <p className="text-sm text-muted-foreground">
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
          <div className="space-y-4">
            <PlrResult result={result} />
            <PlrBreakdown breakdown={result.calculation.breakdown} parcela={result.calculation.parcela} />
          </div>
        )}

        <TaxTable />

        <CalculationHistory
          entries={history}
          onRemove={removeEntry}
          onClear={clearHistory}
          onSelect={handleHistorySelect}
        />
      </div>
    </Layout>
  );
}
