import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Button } from "./ui/button.tsx";
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from "../lib/utils.ts";
import { DiscoverMultiplier } from "../../application/use-cases/DiscoverMultiplier.ts";
import { IrrfCalculator } from "../../infrastructure/tax/IrrfCalculator.ts";
import type { DiscoverMultiplierResult } from "../../application/use-cases/DiscoverMultiplier.ts";

const useCase = new DiscoverMultiplier(new IrrfCalculator());

export function MultiplierDiscovery() {
  const [salario, setSalario] = useState("");
  const [bruto1a, setBruto1a] = useState("");
  const [bruto2a, setBruto2a] = useState("");
  const [result, setResult] = useState<DiscoverMultiplierResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const salarioNum = parseCurrencyInput(salario);
    const bruto1aNum = parseCurrencyInput(bruto1a);
    const bruto2aNum = parseCurrencyInput(bruto2a);

    if (!salarioNum || salarioNum <= 0) {
      setError("Informe um salario valido");
      return;
    }
    if (bruto1aNum < 0 || bruto2aNum < 0) {
      setError("Valores invalidos");
      return;
    }
    if (bruto1aNum === 0 && bruto2aNum === 0) {
      setError("Informe ao menos uma parcela");
      return;
    }

    try {
      const res = useCase.execute({
        salario: salarioNum,
        brutoPrimeiraParcela: bruto1aNum,
        brutoSegundaParcela: bruto2aNum,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setResult(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Descubra seu Multiplicador</CardTitle>
        <CardDescription>
          Informe os valores brutos recebidos para descobrir o multiplicador
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="disc-salario">Salario Base (R$)</Label>
              <Input
                id="disc-salario"
                type="text"
                inputMode="decimal"
                placeholder="5.000,00"
                value={salario}
                onChange={(e) => setSalario(formatCurrencyInput(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="disc-bruto1a">Bruto 1a Parcela (R$)</Label>
                <Input
                  id="disc-bruto1a"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={bruto1a}
                  onChange={(e) => setBruto1a(formatCurrencyInput(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disc-bruto2a">Bruto 2a Parcela (R$)</Label>
                <Input
                  id="disc-bruto2a"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={bruto2a}
                  onChange={(e) => setBruto2a(formatCurrencyInput(e.target.value))}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button type="submit" variant="outline" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Descobrir Multiplicador
          </Button>
        </form>

        {result && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
              <span className="text-sm font-medium">Seu multiplicador</span>
              <span className="text-2xl font-bold text-primary">{result.multiplicador}x</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted/50 px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Total Bruto</p>
                <p className="text-sm font-semibold">{formatCurrency(result.totalBruto)}</p>
              </div>
              <div className="rounded-md bg-muted/50 px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Total Liquido</p>
                <p className="text-sm font-semibold">{formatCurrency(result.totalLiquido)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted/50 px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Liquido 1a Parcela</p>
                <p className="text-sm font-semibold">{formatCurrency(result.liquidoPrimeiraParcela)}</p>
                <p className="text-[10px] text-muted-foreground">IRRF: {formatCurrency(result.irrfPrimeiraParcela)}</p>
              </div>
              <div className="rounded-md bg-muted/50 px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Liquido 2a Parcela</p>
                <p className="text-sm font-semibold">{formatCurrency(result.liquidoSegundaParcela)}</p>
                <p className="text-[10px] text-muted-foreground">IRRF: {formatCurrency(result.irrfSegundaParcela)}</p>
              </div>
            </div>

            <p className="text-[10px] text-center text-muted-foreground">
              IRRF total: {formatCurrency(result.irrfTotal)} — {result.faixa}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
