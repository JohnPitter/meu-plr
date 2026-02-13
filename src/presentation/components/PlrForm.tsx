import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Select } from "./ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card.tsx";
import { BANK_LIST } from "../../domain/value-objects/Bank.ts";
import { formatCurrencyInput, parseCurrencyInput } from "../lib/utils.ts";
import type { PlrInput } from "../../application/dtos/PlrInput.ts";
import type { BankId } from "../../domain/value-objects/Bank.ts";

interface PlrFormProps {
  onSubmit: (input: PlrInput) => void;
}

export function PlrForm({ onSubmit }: PlrFormProps) {
  const [bankId, setBankId] = useState<string>("");
  const [salario, setSalario] = useState<string>("");
  const [meses, setMeses] = useState<string>("12");
  const [primeiraParcela, setPrimeiraParcela] = useState<string>("");
  const [sindical, setSindical] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSalarioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setSalario(formatCurrencyInput(raw));
  }

  function handlePrimeiraParcelaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setPrimeiraParcela(formatCurrencyInput(raw));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!bankId) newErrors.bankId = "Selecione um banco";
    const salarioNum = parseCurrencyInput(salario);
    if (!salarioNum || salarioNum <= 0) newErrors.salario = "Informe um salário válido";
    const mesesNum = parseInt(meses, 10);
    if (!mesesNum || mesesNum < 1 || mesesNum > 12) newErrors.meses = "Entre 1 e 12 meses";

    const primeiraParcelaNum = parseCurrencyInput(primeiraParcela);
    if (primeiraParcela && primeiraParcelaNum < 0) {
      newErrors.primeiraParcela = "Valor inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      bankId: bankId as BankId,
      salario: salarioNum,
      mesesTrabalhados: mesesNum,
      incluirContribuicaoSindical: sindical,
      ...(primeiraParcelaNum > 0 && { valorPrimeiraParcela: primeiraParcelaNum }),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dados do Cálculo</CardTitle>
        <CardDescription>
          Informe os dados abaixo para simular sua PLR
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bank">Banco</Label>
              <Select id="bank" value={bankId} onChange={(e) => setBankId(e.target.value)}>
                <option value="">Selecione o banco</option>
                {BANK_LIST.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </Select>
              {errors.bankId && <p className="text-xs text-destructive">{errors.bankId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salario">Salário Base (R$)</Label>
              <Input
                id="salario"
                type="text"
                inputMode="decimal"
                placeholder="5.000,00"
                value={salario}
                onChange={handleSalarioChange}
              />
              {errors.salario && <p className="text-xs text-destructive">{errors.salario}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="meses">Meses Trabalhados</Label>
              <Select id="meses" value={meses} onChange={(e) => setMeses(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m} {m === 1 ? "mês" : "meses"}
                  </option>
                ))}
              </Select>
              {errors.meses && <p className="text-xs text-destructive">{errors.meses}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primeiraParcela">Valor bruto da 1a parcela (opcional)</Label>
            <Input
              id="primeiraParcela"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={primeiraParcela}
              onChange={handlePrimeiraParcelaChange}
            />
            <p className="text-[10px] text-muted-foreground">
              Informe o bruto recebido em setembro para calcular o IRRF correto da 2a parcela
            </p>
            {errors.primeiraParcela && <p className="text-xs text-destructive">{errors.primeiraParcela}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sindical"
              checked={sindical}
              onChange={(e) => setSindical(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <Label htmlFor="sindical" className="font-normal text-muted-foreground">
              Descontar contribuição sindical (1,5%)
            </Label>
          </div>

          <Button type="submit" className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Calcular PLR
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
