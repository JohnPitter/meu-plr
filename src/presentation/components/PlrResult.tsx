import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { formatCurrency } from "../lib/utils.ts";
import type { PlrResult as PlrResultType } from "../../application/dtos/PlrResult.ts";

interface PlrResultProps {
  result: PlrResultType;
}

export function PlrResult({ result }: PlrResultProps) {
  const { calculation, tax } = result;
  const has2a = calculation.valorPrimeiraParcela != null && calculation.valorPrimeiraParcela > 0;
  const multiplicador = calculation.salario > 0
    ? Math.round((calculation.totalBruto / calculation.salario) * 10) / 10
    : 0;

  return (
    <div className="space-y-4">
      {has2a && (
        <Card className="overflow-hidden">
          <div className="bg-primary px-6 py-5 text-primary-foreground">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                  2a Parcela — Liquido em Marco
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {formatCurrency(calculation.liquidoSegundaParcela)}
                </p>
                <p className="mt-1 text-xs opacity-70">
                  Bruto 2a: {formatCurrency(calculation.brutoSegundaParcela)} — IRRF diferencial: {formatCurrency(calculation.irrfSegundaParcela)}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {calculation.bankName}
              </Badge>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x">
              <div className="px-4 py-3 text-center sm:px-6">
                <p className="text-[10px] text-muted-foreground">Bruto 2a</p>
                <p className="mt-0.5 text-sm font-semibold">{formatCurrency(calculation.brutoSegundaParcela)}</p>
              </div>
              <div className="px-4 py-3 text-center sm:px-6">
                <p className="text-[10px] text-muted-foreground">IRRF 2a</p>
                <p className="mt-0.5 text-sm font-semibold text-destructive">- {formatCurrency(calculation.irrfSegundaParcela)}</p>
              </div>
              <div className="px-4 py-3 text-center sm:px-6">
                <p className="text-[10px] text-muted-foreground">1a Parcela (informada)</p>
                <p className="mt-0.5 text-sm font-semibold">{formatCurrency(calculation.valorPrimeiraParcela!)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className={`${has2a ? "bg-muted/50" : "bg-primary text-primary-foreground"} px-6 py-5`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-xs font-medium uppercase tracking-wider ${has2a ? "text-muted-foreground" : "opacity-80"}`}>
                {has2a ? "PLR Total Anual" : "Valor Liquido"}
              </p>
              <p className={`mt-1 text-3xl font-bold tracking-tight ${has2a ? "" : ""}`}>
                {formatCurrency(calculation.totalLiquido)}
              </p>
              <p className={`mt-1 text-xs ${has2a ? "text-muted-foreground" : "opacity-70"}`}>
                {multiplicador}x o salario de {formatCurrency(calculation.salario)}
                {calculation.mesesTrabalhados < 12 && (
                  <> — proporcional {calculation.mesesTrabalhados}/12</>
                )}
              </p>
            </div>
            {!has2a && (
              <Badge variant="secondary" className="text-xs">
                {calculation.bankName}
              </Badge>
            )}
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
    </div>
  );
}
