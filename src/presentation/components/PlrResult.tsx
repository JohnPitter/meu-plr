import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { formatCurrency } from "../lib/utils.ts";
import type { PlrResult as PlrResultType } from "../../application/dtos/PlrResult.ts";

interface PlrResultProps {
  result: PlrResultType;
}

const PARCELA_LABELS: Record<string, string> = {
  total: "Total Anual",
  primeira: "1a Parcela — Setembro",
  segunda: "2a Parcela — Marco",
};

export function PlrResult({ result }: PlrResultProps) {
  const { calculation, tax } = result;
  const multiplicador = calculation.salario > 0
    ? Math.round((calculation.totalBruto / calculation.salario) * 10) / 10
    : 0;

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary px-6 py-5 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider opacity-80">
              {calculation.parcela !== "total"
                ? PARCELA_LABELS[calculation.parcela]
                : "Valor Liquido"}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{formatCurrency(calculation.totalLiquido)}</p>
            <p className="mt-1 text-xs opacity-70">
              {multiplicador}x o salario de {formatCurrency(calculation.salario)}
              {calculation.mesesTrabalhados < 12 && (
                <> — proporcional {calculation.mesesTrabalhados}/12</>
              )}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="text-xs">
              {calculation.bankName}
            </Badge>
            {calculation.parcela !== "total" && (
              <Badge variant="outline" className="border-primary-foreground/30 text-[10px] text-primary-foreground/80">
                {PARCELA_LABELS[calculation.parcela]}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x">
          <div className="px-4 py-4 text-center sm:px-6">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Bruto
            </div>
            <p className="mt-1 text-sm font-semibold">{formatCurrency(calculation.totalBruto)}</p>
          </div>
          <div className="px-4 py-4 text-center sm:px-6">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3" />
              IRRF
            </div>
            <p className="mt-1 text-sm font-semibold text-destructive">- {formatCurrency(calculation.irrf)}</p>
            <p className="text-[10px] text-muted-foreground">{tax.faixa}</p>
          </div>
          <div className="px-4 py-4 text-center sm:px-6">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <ArrowRight className="h-3 w-3" />
              {calculation.contribuicaoSindical > 0 ? "Sindical" : "Deducoes"}
            </div>
            <p className="mt-1 text-sm font-semibold text-destructive">
              {calculation.contribuicaoSindical > 0
                ? `- ${formatCurrency(calculation.contribuicaoSindical)}`
                : "-"
              }
            </p>
            {calculation.contribuicaoSindical > 0 && (
              <p className="text-[10px] text-muted-foreground">1,5%</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
