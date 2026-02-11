import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Separator } from "./ui/separator.tsx";
import { formatCurrency } from "../lib/utils.ts";
import type { PlrBreakdown as BreakdownType } from "../../domain/entities/PlrCalculation.ts";

interface PlrBreakdownProps {
  breakdown: BreakdownType;
}

export function PlrBreakdown({ breakdown }: PlrBreakdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          Detalhamento do Calculo
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>

      {open && (
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold">1a Parcela (Antecipacao - Setembro)</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regra Basica (54% salario + R$ 1.517,72)</span>
                <span>{formatCurrency(breakdown.regraBasicaAntecipacao)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parcela Adicional</span>
                <span>{formatCurrency(breakdown.parcelaAdicionalAntecipacao)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total 1a Parcela</span>
                <span>{formatCurrency(breakdown.totalAntecipacao)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-semibold">2a Parcela (Exercicio - Marco)</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regra Basica (90% salario + R$ 3.792,41)</span>
                <span>{formatCurrency(breakdown.regraBasicaExercicio)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parcela Adicional</span>
                <span>{formatCurrency(breakdown.parcelaAdicionalExercicio)}</span>
              </div>
              <div className="flex justify-between text-destructive">
                <span>(-) Desconto antecipacao</span>
                <span>- {formatCurrency(breakdown.descontoAntecipacao)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total 2a Parcela</span>
                <span>{formatCurrency(breakdown.totalExercicio)}</span>
              </div>
            </div>
          </div>

          {breakdown.programaComplementar > 0 && breakdown.programaComplementarNome && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 text-sm font-semibold">Programa Complementar</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{breakdown.programaComplementarNome}</span>
                    <span>{formatCurrency(breakdown.programaComplementar)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
