import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card.tsx";
import { formatCurrency } from "../lib/utils.ts";

const TAX_BRACKETS = [
  { from: 0, to: 6677.55, rate: "Isento", deduction: 0 },
  { from: 6677.56, to: 9922.28, rate: "7,5%", deduction: 500.82 },
  { from: 9922.29, to: 13167.0, rate: "15%", deduction: 1244.99 },
  { from: 13167.01, to: 16380.38, rate: "22,5%", deduction: 2232.51 },
  { from: 16380.39, to: Infinity, rate: "27,5%", deduction: 3051.53 },
];

export function TaxTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Tabela IRRF sobre PLR</CardTitle>
        <CardDescription>Tabela exclusiva de tributacao sobre PLR</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Faixa</th>
                <th className="pb-2 font-medium text-muted-foreground">Aliquota</th>
                <th className="pb-2 font-medium text-muted-foreground">Deducao</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {TAX_BRACKETS.map((bracket, i) => (
                <tr key={i}>
                  <td className="py-2">
                    {bracket.to === Infinity
                      ? `Acima de ${formatCurrency(bracket.from)}`
                      : `${formatCurrency(bracket.from)} a ${formatCurrency(bracket.to)}`}
                  </td>
                  <td className="py-2">{bracket.rate}</td>
                  <td className="py-2">
                    {bracket.deduction > 0 ? formatCurrency(bracket.deduction) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
