import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { formatCurrency } from "../lib/utils.ts";

const TAX_BRACKETS = [
  { from: 0, to: 7640.80, rate: "Isento", deduction: 0 },
  { from: 7640.81, to: 9922.28, rate: "7,5%", deduction: 573.06 },
  { from: 9922.29, to: 13167.0, rate: "15%", deduction: 1317.23 },
  { from: 13167.01, to: 16380.38, rate: "22,5%", deduction: 2304.76 },
  { from: 16380.39, to: Infinity, rate: "27,5%", deduction: 3123.78 },
];

export function TaxTable() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          Tabela IRRF sobre PLR
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Faixa</th>
                  <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Alíquota</th>
                  <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Dedução</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {TAX_BRACKETS.map((bracket, i) => (
                  <tr key={i}>
                    <td className="py-2.5">
                      {bracket.to === Infinity
                        ? `Acima de ${formatCurrency(bracket.from)}`
                        : `${formatCurrency(bracket.from)} a ${formatCurrency(bracket.to)}`}
                    </td>
                    <td className="py-2.5 text-right font-medium">{bracket.rate}</td>
                    <td className="py-2.5 text-right">
                      {bracket.deduction > 0 ? formatCurrency(bracket.deduction) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
