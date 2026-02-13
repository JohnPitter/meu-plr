import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary">{title}</h4>
      <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

function BankCard({ name, children }: { name: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-muted/50"
        onClick={() => setOpen(!open)}
      >
        {name}
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t px-3 py-2 text-sm text-muted-foreground leading-relaxed">{children}</div>}
    </div>
  );
}

export function HowItWorks() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            Como funciona o cálculo?
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </CardTitle>
      </CardHeader>

      {open && (
        <CardContent className="space-y-6 pt-0">
          <Section title="Base Legal">
            <p>
              O cálculo segue a <strong>CCT FENABAN 2024/2026</strong> (exercício 2025),
              com reajuste de <strong>5,68%</strong> (INPC 5,05% + 0,6% de ganho real)
              aplicado em 01/09/2025.
            </p>
          </Section>

          <Section title="1a Parcela — Antecipação (Setembro)">
            <p>Paga até 30 de setembro. Fórmula:</p>
            <div className="rounded-md bg-muted/50 px-3 py-2 font-mono text-xs">
              Regra Básica = min(54% x salário + R$ 2.119,75 , R$ 11.371,44)<br />
              Parcela Adicional = R$ 3.668,29<br />
              Total 1a = (Regra Básica + Parcela Adicional) x (meses / 12)
            </div>
          </Section>

          <Section title="2a Parcela — Exercício (Março)">
            <p>Paga até 1o de março do ano seguinte. Fórmula:</p>
            <div className="rounded-md bg-muted/50 px-3 py-2 font-mono text-xs">
              Regra Básica = min(90% x salário + R$ 3.532,92 , R$ 18.952,40)<br />
              Parcela Adicional = R$ 7.336,60<br />
              Total Exercício = (Regra Básica + Parcela Adicional) x (meses / 12)<br />
              Total 2a = Total Exercício - Total 1a (desconto da antecipação)
            </div>
          </Section>

          <Section title="Majoração">
            <p>
              Em bancos lucrativos (quando o total de regra básica pago é menor que 5% do lucro líquido),
              a regra básica do exercício é substituída por:
            </p>
            <div className="rounded-md bg-muted/50 px-3 py-2 font-mono text-xs">
              Regra Básica Majorada = min(2,2 x salário , R$ 41.695,29)
            </div>
            <p>
              Aplica-se a: <strong>Itaú, Santander, Bradesco, BTG Pactual</strong>. Não se aplica a: BB, Caixa, Safra.
            </p>
          </Section>

          <Section title="Programas Complementares por Banco">
            <p>
              Além da PLR FENABAN, cada banco pode ter um programa próprio que é somado ao total.
              Clique em cada banco para ver os detalhes:
            </p>
            <div className="space-y-1.5">
              <BankCard name="Itau Unibanco — PCR">
                <p className="mb-1.5">
                  <strong>Programa Complementar de Resultados (PCR)</strong> — valor fixo baseado no ROE do banco:
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-1 text-left">ROE</th>
                      <th className="pb-1 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr><td className="py-1">&gt; 22,1%</td><td className="py-1 text-right font-medium">R$ 4.299,86</td></tr>
                    <tr><td className="py-1">&le; 22,1%</td><td className="py-1 text-right font-medium">R$ 3.908,05</td></tr>
                  </tbody>
                </table>
                <p className="mt-1.5 text-[10px]">Default do calculador: 2o patamar (R$ 4.299,86). A PLR do Itaú nunca é inferior a PLR CCT + PCR.</p>
              </BankCard>

              <BankCard name="Santander — PPRS">
                <p className="mb-1.5">
                  <strong>Programa Próprio de Resultados Santander (PPRS)</strong> — valor baseado no ROAE:
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-1 text-left">ROAE</th>
                      <th className="pb-1 text-right">Valor 2025</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr><td className="py-1">&lt; 13%</td><td className="py-1 text-right font-medium">R$ 3.210,04</td></tr>
                    <tr><td className="py-1">13% a 15,5%</td><td className="py-1 text-right font-medium">R$ 3.880,84</td></tr>
                    <tr><td className="py-1">&gt; 15,5%</td><td className="py-1 text-right font-medium">R$ 4.036,10</td></tr>
                  </tbody>
                </table>
                <p className="mt-1.5 text-[10px]">
                  Default do calculador: faixa 2 (ROAE 13-15,5%). PPRS é somado à PLR CCT, nunca compensado.
                  PPE e PPG (programas por área) não são modelados.
                </p>
              </BankCard>

              <BankCard name="Bradesco — PRB">
                <p className="mb-1.5">
                  <strong>Programa de Remuneração Bradesco (PRB)</strong> — valor baseado no ROAE:
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-1 text-left">ROAE</th>
                      <th className="pb-1 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr><td className="py-1">&ge; 15,5%</td><td className="py-1 text-right font-medium">R$ 1.000</td></tr>
                    <tr><td className="py-1">&ge; 17,0%</td><td className="py-1 text-right font-medium">R$ 2.000</td></tr>
                    <tr><td className="py-1">&ge; 18,5%</td><td className="py-1 text-right font-medium">R$ 2.500</td></tr>
                  </tbody>
                </table>
                <p className="mt-1.5 text-[10px]">
                  Default do calculador: R$ 2.500 (ROAE &ge; 18,5%).
                  PPR Supera (2025) para cargos de vendas não é modelado.
                </p>
              </BankCard>

              <BankCard name="Banco do Brasil — Módulo BB">
                <p>
                  <strong>Módulo BB</strong>: 4% do lucro líquido distribuído linearmente + parcela variável por desempenho (sistema Conexão).
                  Teto: 7 salários-paradigma por ano.
                </p>
                <p className="mt-1.5">
                  Default do calculador: <strong>R$ 3.500,00</strong> (estimativa).
                  Não aplica majoração (banco público).
                </p>
              </BankCard>

              <BankCard name="Caixa Econômica Federal — PLR Social">
                <p>
                  <strong>PLR Social</strong>: 4% do lucro líquido distribuído linearmente, proporcional a dias trabalhados.
                </p>
                <p className="mt-1.5">Fórmula de antecipação diferente dos bancos privados:</p>
                <div className="rounded-md bg-muted/50 px-3 py-1.5 font-mono text-xs my-1.5">
                  Antecipação = min(45% x salário + R$ 1.766,46 , R$ 9.476,20)
                </div>
                <p>
                  Teto individual: <strong>3x salário base</strong>. Garantia mínima: 1 remuneração base.
                  Default do calculador: R$ 3.200,00 (estimativa). Não aplica majoração.
                </p>
              </BankCard>

              <BankCard name="BTG Pactual">
                <p>
                  Segue a <strong>PLR FENABAN com majoração</strong> (banco lucrativo).
                  Bônus de performance discricionário (5 a 8 salários em média) não é modelado por ser variável e não público.
                </p>
              </BankCard>

              <BankCard name="Banco Safra">
                <p>
                  Segue apenas a <strong>PLR FENABAN genérica</strong>, sem majoração e sem programa complementar.
                </p>
              </BankCard>
            </div>
          </Section>

          <Section title="Proporcionalidade">
            <p>
              A PLR é proporcional aos meses trabalhados: <strong>1/12 por mês</strong> (fração &ge; 15 dias = 1 mês integral).
            </p>
          </Section>

          <Section title="IRRF sobre PLR">
            <p>
              O Imposto de Renda é calculado com tabela exclusiva para PLR (separada do salário).
              A <strong>1a parcela</strong> tem IRRF retido sobre o valor da antecipação.
              A <strong>2a parcela</strong> recalcula o IRRF sobre o total anual e desconta o que já foi retido na 1a.
            </p>
            <div className="rounded-md bg-muted/50 px-3 py-2 font-mono text-xs">
              IRRF 2a parcela = IRRF(PLR total) - IRRF(1a parcela)
            </div>
          </Section>

          <Section title="Contribuição Sindical">
            <p>
              Desconto opcional de <strong>1,5%</strong> sobre o total bruto da PLR, conforme CCT FENABAN.
            </p>
          </Section>

          <div className="rounded-lg bg-muted/50 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              <strong>Importante:</strong> Esta calculadora utiliza valores de referência da CCT FENABAN 2024/2026
              e dos ACTs (Acordos Coletivos de Trabalho) específicos de cada banco. Os valores reais podem variar
              conforme políticas internas, desempenho individual e decisões do banco. Consulte seu holerite e o
              sindicato da sua categoria para valores exatos.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
