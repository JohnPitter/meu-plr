import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Select } from "./ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card.tsx";
import { BANK_LIST } from "../../domain/value-objects/Bank.ts";
import type { PlrInput } from "../../application/dtos/PlrInput.ts";
import type { BankId } from "../../domain/value-objects/Bank.ts";

interface PlrFormProps {
  onSubmit: (input: PlrInput) => void;
}

export function PlrForm({ onSubmit }: PlrFormProps) {
  const [bankId, setBankId] = useState<string>("");
  const [salario, setSalario] = useState<string>("");
  const [meses, setMeses] = useState<string>("12");
  const [sindical, setSindical] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!bankId) newErrors.bankId = "Selecione um banco";
    const salarioNum = parseFloat(salario.replace(/\./g, "").replace(",", "."));
    if (!salarioNum || salarioNum <= 0) newErrors.salario = "Informe um salario valido";
    const mesesNum = parseInt(meses, 10);
    if (!mesesNum || mesesNum < 1 || mesesNum > 12) newErrors.meses = "Entre 1 e 12 meses";

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
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calcular PLR
        </CardTitle>
        <CardDescription>
          Informe seus dados para simular a PLR conforme a CCT FENABAN
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
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
            <Label htmlFor="salario">Salario Base (R$)</Label>
            <Input
              id="salario"
              type="text"
              inputMode="decimal"
              placeholder="5.000,00"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
            />
            {errors.salario && <p className="text-xs text-destructive">{errors.salario}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="meses">Meses Trabalhados no Ano</Label>
            <Select id="meses" value={meses} onChange={(e) => setMeses(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m} {m === 1 ? "mes" : "meses"} ({m}/12 avos)
                </option>
              ))}
            </Select>
            {errors.meses && <p className="text-xs text-destructive">{errors.meses}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sindical"
              checked={sindical}
              onChange={(e) => setSindical(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="sindical">Descontar contribuicao sindical (1,5%)</Label>
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
