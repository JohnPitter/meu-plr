import { DollarSign, TrendingUp, MinusCircle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { Separator } from "./ui/separator.tsx";
import { formatCurrency } from "../lib/utils.ts";
import type { PlrResult as PlrResultType } from "../../application/dtos/PlrResult.ts";

interface PlrResultProps {
  result: PlrResultType;
}

export function PlrResult({ result }: PlrResultProps) {
  const { calculation, tax } = result;
  const multiplicador = calculation.salario > 0
    ? Math.round((calculation.totalBruto / calculation.salario) * 10) / 10
    : 0;

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Resultado da PLR
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {multiplicador}x
            </Badge>
            <Badge>{calculation.bankName}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-primary/5 p-4 text-center">
          <p className="text-sm text-muted-foreground">Valor Liquido Total</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(calculation.totalLiquido)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {multiplicador}x o salario de {formatCurrency(calculation.salario)}
            {calculation.mesesTrabalhados < 12 && (
              <> — proporcional {calculation.mesesTrabalhados}/12 avos</>
            )}
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Total Bruto
            </span>
            <span className="font-medium">{formatCurrency(calculation.totalBruto)}</span>
          </div>

          <div className="flex justify-between text-sm text-destructive">
            <span className="flex items-center gap-1">
              <MinusCircle className="h-3 w-3" /> IRRF ({tax.faixa})
            </span>
            <span>- {formatCurrency(calculation.irrf)}</span>
          </div>

          {calculation.contribuicaoSindical > 0 && (
            <div className="flex justify-between text-sm text-destructive">
              <span className="flex items-center gap-1">
                <MinusCircle className="h-3 w-3" /> Contribuicao Sindical (1,5%)
              </span>
              <span>- {formatCurrency(calculation.contribuicaoSindical)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
