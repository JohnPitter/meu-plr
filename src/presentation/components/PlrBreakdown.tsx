import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { formatCurrency } from "../lib/utils.ts";
import type { PlrBreakdown as BreakdownType } from "../../domain/entities/PlrCalculation.ts";

interface PlrBreakdownProps {
  breakdown: BreakdownType;
  salario: number;
}

function LineItem({ label, value, variant }: { label: string; value: string; variant?: "default" | "negative" | "bold" }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className={variant === "bold" ? "font-medium" : "text-muted-foreground"}>{label}</span>
      <span className={
        variant === "negative" ? "text-destructive" :
        variant === "bold" ? "font-semibold" : ""
      }>
        {value}
      </span>
    </div>
  );
}

export function PlrBreakdown({ breakdown, salario }: PlrBreakdownProps) {
  const [open, setOpen] = useState(false);

  const standardRB = salario * 0.90 + 3532.92;
  const isMajorada = breakdown.regraBasicaExercicio > standardRB * 1.01;
  const exercicioRBLabel = isMajorada
    ? "Regra Basica majorada (2,2x salario)"
    : "Regra Basica (90% salario + R$ 3.532,92)";

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          Detalhamento do Calculo
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </CardTitle>
      </CardHeader>

      {open && (
        <CardContent className="space-y-5 pt-0">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              1a Parcela — Antecipacao (Setembro)
            </p>
            <div className="rounded-lg bg-muted/50 px-4 py-2">
              <LineItem label="Regra Basica (54% salario + R$ 2.119,75)" value={formatCurrency(breakdown.regraBasicaAntecipacao)} />
              <LineItem label="Parcela Adicional (2,2% lucro liquido)" value={formatCurrency(breakdown.parcelaAdicionalAntecipacao)} />
              <div className="my-1 h-px bg-border" />
              <LineItem label="Total 1a Parcela" value={formatCurrency(breakdown.totalAntecipacao)} variant="bold" />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              2a Parcela — Exercicio (Marco)
            </p>
            <div className="rounded-lg bg-muted/50 px-4 py-2">
              <LineItem label={exercicioRBLabel} value={formatCurrency(breakdown.regraBasicaExercicio)} />
              <LineItem label="Parcela Adicional (2,2% lucro liquido)" value={formatCurrency(breakdown.parcelaAdicionalExercicio)} />
              <LineItem label="(-) Desconto antecipacao" value={`- ${formatCurrency(breakdown.descontoAntecipacao)}`} variant="negative" />
              <div className="my-1 h-px bg-border" />
              <LineItem label="Total 2a Parcela" value={formatCurrency(breakdown.totalExercicio)} variant="bold" />
            </div>
            {isMajorada && (
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                A regra basica foi majorada de {formatCurrency(Math.min(standardRB, 18952.40))} para {formatCurrency(breakdown.regraBasicaExercicio)} (limite 2,2 salarios conforme CCT FENABAN)
              </p>
            )}
          </div>

          {breakdown.programaComplementar > 0 && breakdown.programaComplementarNome && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Programa Complementar
              </p>
              <div className="rounded-lg bg-muted/50 px-4 py-2">
                <LineItem label={breakdown.programaComplementarNome} value={formatCurrency(breakdown.programaComplementar)} variant="bold" />
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
