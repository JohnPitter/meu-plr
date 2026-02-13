import { useState } from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { formatCurrency } from "../lib/utils.ts";
import { IrrfCalculator } from "../../infrastructure/tax/IrrfCalculator.ts";
import type { PlrResult as PlrResultType } from "../../application/dtos/PlrResult.ts";

interface PlrResultProps {
  result: PlrResultType;
}

const MULTIPLIER_LEVELS = [0.9, 1.2, 1.5, 1.8, 2.2];
const taxCalc = new IrrfCalculator();

function MultiplierScale({ salario }: { salario: number }) {
  const [selected, setSelected] = useState<number | null>(null);

  if (salario <= 0) return null;

  const selectedBruto = selected != null ? salario * selected : null;
  const selectedTax = selectedBruto != null ? taxCalc.calculate(selectedBruto) : null;
  const selectedLiquido = selectedBruto != null && selectedTax != null
    ? Math.round((selectedBruto - selectedTax.irrf) * 100) / 100
    : null;

  return (
    <div className="border-t px-4 py-3 sm:px-6">
      <p className="text-[10px] text-muted-foreground mb-2">Referência por multiplicador</p>
      <div className="flex gap-1.5">
        {MULTIPLIER_LEVELS.map((mult) => {
          const bruto = salario * mult;
          const isSelected = mult === selected;
          return (
            <button
              type="button"
              key={mult}
              onClick={() => setSelected(isSelected ? null : mult)}
              className={`flex-1 rounded-md py-1.5 text-center transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              <p className={`text-[10px] font-medium ${
                isSelected ? "text-primary-foreground" : "text-muted-foreground"
              }`}>
                {mult}x
              </p>
              <p className={`text-xs font-semibold truncate px-1 ${
                isSelected ? "text-primary-foreground" : ""
              }`}>
                {formatCurrency(bruto)}
              </p>
            </button>
          );
        })}
      </div>
      {selected != null && selectedBruto != null && selectedTax != null && selectedLiquido != null && (
        <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-md bg-muted/40 px-3 py-2 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground">Bruto</p>
            <p className="text-xs font-semibold">{formatCurrency(selectedBruto)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">IRRF</p>
            <p className="text-xs font-semibold text-destructive">- {formatCurrency(selectedTax.irrf)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Líquido</p>
            <p className="text-xs font-semibold text-primary">{formatCurrency(selectedLiquido)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlrResult({ result }: PlrResultProps) {
  const { calculation, tax } = result;
  const has2a = calculation.valorPrimeiraParcela != null && calculation.valorPrimeiraParcela > 0;

  return (
    <div className="space-y-3">
      {has2a && (
        <Card className="overflow-hidden">
          <div className="bg-primary px-6 py-5 text-primary-foreground">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                  2a Parcela — Líquido em Março
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {formatCurrency(calculation.liquidoSegundaParcela)}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {calculation.bankName}
              </Badge>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x text-center">
              <div className="px-4 py-3 sm:px-6">
                <p className="text-[10px] text-muted-foreground">Bruto 2a</p>
                <p className="mt-0.5 text-sm font-semibold">{formatCurrency(calculation.brutoSegundaParcela)}</p>
              </div>
              <div className="px-4 py-3 sm:px-6">
                <p className="text-[10px] text-muted-foreground">IRRF diferencial</p>
                <p className="mt-0.5 text-sm font-semibold text-destructive">- {formatCurrency(calculation.irrfSegundaParcela)}</p>
              </div>
              <div className="px-4 py-3 sm:px-6">
                <p className="text-[10px] text-muted-foreground">1a parcela (informada)</p>
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
                {has2a ? "PLR Total Anual" : "Valor Líquido"}
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {formatCurrency(calculation.totalLiquido)}
              </p>
              <p className={`mt-1 text-xs ${has2a ? "text-muted-foreground" : "opacity-70"}`}>
                {formatCurrency(calculation.salario)}
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
          <div className="grid grid-cols-3 divide-x text-center">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Bruto
              </div>
              <p className="mt-1 text-sm font-semibold">{formatCurrency(calculation.totalBruto)}</p>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3" />
                IRRF
              </div>
              <p className="mt-1 text-sm font-semibold text-destructive">- {formatCurrency(calculation.irrf)}</p>
              <p className="text-[10px] text-muted-foreground">{tax.faixa}</p>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <ArrowRight className="h-3 w-3" />
                {calculation.contribuicaoSindical > 0 ? "Sindical" : "Deduções"}
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
          <MultiplierScale salario={calculation.salario} />
        </CardContent>
      </Card>
    </div>
  );
}
