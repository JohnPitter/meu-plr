import { useState } from "react";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ExternalLink,
  FileText,
  DollarSign,
  Info,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { cn } from "../lib/utils.ts";

// ─── Data ────────────────────────────────────────────────────────────────────

const FINANCIAL_DATA = [
  { label: "ROE anualizado Bradesco 2025", value: "14,8%", status: "ok", note: "Confirmado em múltiplas fontes" },
  { label: "Gatilho PRB (ROAE mínimo)", value: "15,5%", status: "ok", note: "Acordo coletivo ago/2025" },
  { label: "Diferença (14,8% vs 15,5%)", value: "0,7 p.p.", status: "ok", note: "Margem estreita" },
  { label: "Lucro líquido recorrente 2025", value: "R$ 24,652 bi", status: "ok", note: "+26,1% vs 2024" },
];

const PRB_RULES = [
  { faixa: "≥ 15,5%", valor: "R$ 1.000", atingido: false },
  { faixa: "≥ 17,0%", valor: "R$ 2.000", atingido: false },
  { faixa: "≥ 18,5%", valor: "R$ 2.500", atingido: false },
];

const FIRST_INSTALLMENT = [
  { componente: "Regra Básica (54% salário)", formula: "54% × salário + R$ 2.119,75", teto: "Teto R$ 11.371,44" },
  { componente: "Teto global", formula: "12,8% × lucro 1º sem.", teto: "12,8% × R$ 11,931 bi = R$ 1,527 bi" },
  { componente: "Parcela Adicional", formula: "2,2% × lucro ÷ nº func.", teto: "Teto R$ 3.668,29/func." },
];

const SECOND_INSTALLMENT = [
  { componente: "Regra Básica (90% salário)", formula: "90% × salário + R$ 3.532,92", teto: "Teto R$ 18.952,48" },
  { componente: "Teto global majorado", formula: "5% × lucro anual", teto: "5% × R$ 24,652 bi = R$ 1,233 bi" },
  { componente: "Parcela Adicional", formula: "2,2% × lucro ÷ nº func.", teto: "Teto R$ 7.336,62/func." },
];

const EXAMPLE_CALC = [
  {
    etapa: "Regra Básica",
    first: "54% × 5.000 + 2.119,75 = R$ 4.819,75",
    second: "90% × 5.000 + 3.532,92 = R$ 8.032,92",
  },
  {
    etapa: "Parcela Adicional",
    first: "~R$ 3.197 (≈R$ 262,5 mi ÷ 82.095)",
    second: "~R$ 6.606 (≈R$ 542,3 mi ÷ 82.095)",
  },
  {
    etapa: "Subtotal Bruto",
    first: "~R$ 8.017",
    second: "~R$ 14.639 − R$ 8.017 = ~R$ 6.622",
    highlight: true,
  },
];

const SOURCE_DISCREPANCIES = [
  { componente: "Valor fixo 1ª parcela", sindicato: "R$ 2.119,75", minhaplr: "R$ 1.517,72" },
  { componente: "Teto individual 1ª parcela", sindicato: "R$ 11.371,44", minhaplr: "R$ 8.141,83" },
  { componente: "Teto adicional 1ª parcela", sindicato: "R$ 3.668,29", minhaplr: "R$ 2.529,54" },
];

const RISKS = [
  {
    type: "warning" as const,
    title: "Bradesco tecnicamente correto na negativa do PRB",
    description: "O ROAE de 14,8% não atingiu o gatilho mínimo de 15,5%. A margem de 0,7 p.p. é estreita mas a regra é objetiva.",
  },
  {
    type: "info" as const,
    title: "Argumento sindical é legítimo",
    description: "Com lucro crescendo 26,1% e ROE a 0,7 p.p. do gatilho, a pressão por pagamento voluntário é razoável.",
  },
  {
    type: "warning" as const,
    title: "Supera e PRB NÃO são acumuláveis",
    description: "Prevalece o programa de maior valor. Nenhum deles é descontado da PLR-CCT — são programas independentes.",
  },
  {
    type: "info" as const,
    title: "IR e contribuição sindical incidem sobre a PLR",
    description: "Imposto de Renda progressivo (isento até R$ 6.677,55; até 27,5%). Contribuição negocial: 1,5% sobre o bruto.",
  },
];

const CONCLUSION_TABLE = [
  { aspecto: "Dados financeiros da notícia", resultado: "ok", texto: "Todos corretos e verificados" },
  { aspecto: "Regra do PRB (gatilho ROAE)", resultado: "ok", texto: "14,8% < 15,5% — cálculo correto" },
  { aspecto: "Fórmulas da PLR-CCT", resultado: "ok", texto: "Consistentes entre fontes sindicais" },
  { aspecto: "Parcela adicional (2,2% lucro)", resultado: "ok", texto: "Valores dentro dos tetos individuais" },
  { aspecto: "MinhaPLR vs Sindicato", resultado: "warn", texto: "Divergência — provável falta de reajuste no site" },
];

const SOURCES = [
  { label: "Sindicato solicita PRB — Bradesco nega", href: "https://spbancarios.com.br/02/2026/sindicato-solicita-o-pagamento-do-prb-e-bradesco-nega" },
  { label: "Bradesco lucra R$ 24,6 bi em 2025", href: "https://spbancarios.com.br/02/2026/bradesco-lucra-r-246-bi-em-2025-mas-corta-mais-de-2-mil-empregos-bancarios" },
  { label: "Bancários aprovam Supera e PRB (ago/2025)", href: "https://spbancarios.com.br/08/2025/bancarios-do-bradesco-e-do-bradesco-financiamentos-aprovam-supera-e-prb" },
  { label: "PLR dos bancários 2026 — Sindicato CP", href: "https://sindicatocp.org.br/2026/02/10/plr-dos-bancarios-2026/" },
  { label: "Valores 2ª parcela PLR 2025", href: "https://www.seebcgms.org.br/noticias-gerais/confira-os-valores-que-bancarios-recebem-na-2a-parcela-da-plr-2025-conforme-a-cct/" },
  { label: "Calculadora PLR Bancários — MinhaPLR", href: "https://www.minhaplr.com.br/" },
  { label: "Contraf-CUT — Bradesco anuncia pagamento PLR", href: "https://contrafcut.com.br/noticias/a-pedido-da-contraf-cut-bradesco-anuncia-pagamento-da-plr-para-dia-21/" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionToggle({
  icon: Icon,
  title,
  children,
  defaultOpen = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {title}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </CardTitle>
      </CardHeader>
      {open && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

function StatusIcon({ status }: { status: "ok" | "warn" | "error" }) {
  if (status === "ok") return <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />;
  if (status === "warn") return <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500" />;
  return <XCircle className="h-4 w-4 shrink-0 text-destructive" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BradescoPlrReport() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border bg-primary/5 p-5 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-lg tracking-tight">
            Análise PLR/PRB Bradesco — 2025/2026
          </h2>
          <Badge variant="secondary" className="ml-auto text-xs">
            Atualizado fev/2026
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Verificação dos cálculos e dados da notícia{" "}
          <a
            href="https://spbancarios.com.br/02/2026/sindicato-solicita-o-pagamento-do-prb-e-bradesco-nega"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-primary underline underline-offset-2 hover:opacity-80"
          >
            "Sindicato solicita PRB — Bradesco nega"
            <ExternalLink className="h-3 w-3" />
          </a>{" "}
          (12/02/2026).
        </p>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
          {[
            { label: "ROE Bradesco 2025", value: "14,8%" },
            { label: "Gatilho PRB (ROAE)", value: "15,5%" },
            { label: "Lucro recorrente 2025", value: "R$ 24,6 bi" },
            { label: "Crescimento YoY", value: "+26,1%" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-card border px-3 py-2 text-center">
              <p className="text-base font-bold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 1 - Financial Data Verification */}
      <SectionToggle icon={TrendingUp} title="Verificação dos Dados Financeiros" defaultOpen>
        <div className="space-y-2">
          {FINANCIAL_DATA.map(({ label, value, status, note }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 bg-muted/30"
            >
              <StatusIcon status={status as "ok" | "warn" | "error"} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <p className="text-sm font-medium">{label}</p>
                  <span className="text-sm font-bold text-primary">{value}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionToggle>

      {/* 2 - PRB Rules */}
      <SectionToggle icon={AlertCircle} title="Regras do PRB e Situação Atual">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            O PRB (Programa de Remuneração Bradesco) possui gatilhos de ROAE definidos em acordo coletivo.
            Com ROAE de <strong className="text-foreground">14,8%</strong>, o banco ficou{" "}
            <strong className="text-foreground">0,7 p.p. abaixo</strong> do gatilho mínimo:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left py-2 pr-4 font-medium">Faixa ROAE</th>
                  <th className="text-right py-2 pr-4 font-medium">Valor PRB</th>
                  <th className="text-right py-2 font-medium">Atingido em 2025?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PRB_RULES.map(({ faixa, valor, atingido }) => (
                  <tr key={faixa} className={cn("transition-colors", !atingido && "opacity-60")}>
                    <td className="py-2.5 pr-4 font-medium">{faixa}</td>
                    <td className="py-2.5 pr-4 text-right">{valor}</td>
                    <td className="py-2.5 text-right">
                      {atingido ? (
                        <span className="inline-flex items-center gap-1 text-success font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Sim
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-destructive font-medium">
                          <XCircle className="h-3.5 w-3.5" /> Não
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 flex gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Conclusão:</strong> O Bradesco está{" "}
              <strong className="text-foreground">tecnicamente correto</strong> ao negar o PRB —
              o ROAE de 14,8% não atingiu o gatilho mínimo de 15,5%. A margem estreita
              (0,7 p.p.) justifica a pressão sindical, mas a regra contratual é objetiva.
            </p>
          </div>
        </div>
      </SectionToggle>

      {/* 3 - PLR CCT Calculations */}
      <SectionToggle icon={DollarSign} title="Verificação dos Cálculos PLR-CCT (2024–2026)">
        <div className="space-y-6">
          {/* 1st installment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">1ª Parcela</Badge>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Antecipação — Setembro/2025 · Base: R$ 11,931 bi
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground uppercase tracking-wide">
                    <th className="text-left py-1.5 pr-3 font-medium">Componente</th>
                    <th className="text-left py-1.5 pr-3 font-medium hidden sm:table-cell">Fórmula</th>
                    <th className="text-right py-1.5 font-medium">Teto / Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {FIRST_INSTALLMENT.map(({ componente, formula, teto }) => (
                    <tr key={componente} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2 pr-3 font-medium">{componente}</td>
                      <td className="py-2 pr-3 text-muted-foreground hidden sm:table-cell">{formula}</td>
                      <td className="py-2 text-right text-muted-foreground">{teto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground space-y-1">
              <p>
                <strong className="text-foreground">Parcela adicional verificada:</strong>{" "}
                R$ 262,5 mi ÷ ~82.095 funcionários ≈{" "}
                <strong className="text-foreground">R$ 3.197/func.</strong>{" "}
                <span className="inline-flex items-center gap-0.5 text-success">
                  <CheckCircle2 className="h-3 w-3" /> Abaixo do teto de R$ 3.668,29
                </span>
              </p>
            </div>
          </div>

          {/* 2nd installment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">2ª Parcela</Badge>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Fevereiro–Março/2026 · Base: R$ 24,652 bi
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground uppercase tracking-wide">
                    <th className="text-left py-1.5 pr-3 font-medium">Componente</th>
                    <th className="text-left py-1.5 pr-3 font-medium hidden sm:table-cell">Fórmula</th>
                    <th className="text-right py-1.5 font-medium">Teto / Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SECOND_INSTALLMENT.map(({ componente, formula, teto }) => (
                    <tr key={componente} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2 pr-3 font-medium">{componente}</td>
                      <td className="py-2 pr-3 text-muted-foreground hidden sm:table-cell">{formula}</td>
                      <td className="py-2 text-right text-muted-foreground">{teto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground space-y-1">
              <p>
                <strong className="text-foreground">Parcela adicional verificada:</strong>{" "}
                R$ 542,3 mi ÷ ~82.095 funcionários ≈{" "}
                <strong className="text-foreground">R$ 6.606/func.</strong>{" "}
                <span className="inline-flex items-center gap-0.5 text-success">
                  <CheckCircle2 className="h-3 w-3" /> Abaixo do teto de R$ 7.336,62
                </span>
              </p>
            </div>
          </div>

          {/* Example calculation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Exemplo — Salário de R$ 5.000
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground uppercase tracking-wide">
                    <th className="text-left py-1.5 pr-3 font-medium">Etapa</th>
                    <th className="text-right py-1.5 pr-3 font-medium">1ª Parcela (set/25)</th>
                    <th className="text-right py-1.5 font-medium">2ª Parcela (mar/26)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {EXAMPLE_CALC.map(({ etapa, first, second, highlight }) => (
                    <tr
                      key={etapa}
                      className={cn(
                        "transition-colors",
                        highlight
                          ? "bg-primary/5 font-semibold text-primary"
                          : "hover:bg-muted/30",
                      )}
                    >
                      <td className="py-2 pr-3">{etapa}</td>
                      <td className="py-2 pr-3 text-right">{first}</td>
                      <td className="py-2 text-right">{second}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionToggle>

      {/* 4 - Source Discrepancies */}
      <SectionToggle icon={AlertTriangle} title="Divergências entre Fontes">
        <div className="space-y-4">
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 flex gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Foram identificadas <strong className="text-foreground">divergências nos valores fixos</strong> entre
              as fontes do Sindicato/Contraf-CUT e o site MinhaPLR.com.br. Provável causa: reajuste de{" "}
              <strong className="text-foreground">~5,68% (INPC + ganho real)</strong> de setembro/2025 não refletido
              no site.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left py-2 pr-4 font-medium">Componente</th>
                  <th className="text-right py-2 pr-4 font-medium">Sindicato SP / Contraf-CUT</th>
                  <th className="text-right py-2 font-medium">MinhaPLR.com.br</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SOURCE_DISCREPANCIES.map(({ componente, sindicato, minhaplr }) => (
                  <tr key={componente} className="hover:bg-muted/40 transition-colors">
                    <td className="py-2.5 pr-4 text-sm">{componente}</td>
                    <td className="py-2.5 pr-4 text-right font-semibold text-success">{sindicato}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{minhaplr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            ✅ Os valores do <strong className="text-foreground">Sindicato SP</strong> são os mais atualizados e devem ser utilizados como referência.
          </p>
        </div>
      </SectionToggle>

      {/* 5 - Risks & Observations */}
      <SectionToggle icon={Info} title="Observações e Pontos de Atenção">
        <div className="space-y-3">
          {RISKS.map(({ type, title, description }) => (
            <div
              key={title}
              className={cn(
                "flex gap-3 rounded-lg px-4 py-3 text-sm",
                type === "warning"
                  ? "border border-yellow-500/30 bg-yellow-500/5"
                  : "border border-primary/20 bg-primary/5",
              )}
            >
              {type === "warning" ? (
                <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500 mt-0.5" />
              ) : (
                <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-muted-foreground leading-relaxed mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionToggle>

      {/* 6 - Sources */}
      <SectionToggle icon={BookOpen} title="Fontes Consultadas">
        <div className="grid gap-2 sm:grid-cols-2">
          {SOURCES.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors group"
            >
              <p className="font-medium group-hover:text-primary transition-colors truncate pr-2">
                {label}
              </p>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </SectionToggle>

      {/* Conclusion */}
      <div className="rounded-xl border bg-primary/5 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Conclusão da Análise</h3>
        </div>

        <div className="space-y-2">
          {CONCLUSION_TABLE.map(({ aspecto, resultado, texto }) => (
            <div key={aspecto} className="flex items-start gap-3 rounded-lg px-3 py-2 bg-card border">
              <StatusIcon status={resultado as "ok" | "warn" | "error"} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{aspecto}</p>
                <p className="text-xs text-muted-foreground">{texto}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Os dados e cálculos apresentados na notícia estão{" "}
          <strong className="text-foreground">corretos</strong>. O Bradesco{" "}
          <strong className="text-foreground">não é legalmente obrigado a pagar o PRB</strong> —
          o ROAE ficou 0,7 p.p. abaixo do gatilho mínimo. A{" "}
          <strong className="text-foreground">PLR-CCT</strong>, por sua vez, é devida normalmente e
          estava prevista para pagamento até <strong className="text-foreground">01/03/2026</strong>.
        </p>

        <div className="rounded-lg bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
            <span>
              Análise realizada em fevereiro de 2026. Dados baseados em fontes sindicais (Sindicato dos
              Bancários de SP, Contraf-CUT) e resultados financeiros divulgados pelo Bradesco.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
