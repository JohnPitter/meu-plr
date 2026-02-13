import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import researchData from "../../../docs/bank-plr-research.json";

function SourceGroup({ bank, sources }: { bank: string; sources: string[] }) {
  return (
    <div>
      <h5 className="mb-1 text-xs font-semibold">{bank}</h5>
      <ul className="list-disc pl-4 space-y-0.5">
        {sources.map((src) =>
          src.startsWith("http") ? (
            <li key={src}>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 break-all"
              >
                {src}
              </a>
            </li>
          ) : (
            <li key={src}>{src}</li>
          ),
        )}
      </ul>
    </div>
  );
}

export function DataSources() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            De onde vieram essas informações?
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </CardTitle>
      </CardHeader>

      {open && (
        <CardContent className="space-y-5 pt-0">
          <div className="space-y-1 text-sm text-muted-foreground leading-relaxed">
            <p>
              Os valores e regras utilizados nesta calculadora foram extraídos de
              <strong> documentos oficiais</strong> (CCTs, ACTs e acordos sindicais) e
              cruzados com múltiplas fontes públicas.
            </p>
            <p>
              Base legal: <strong>{researchData.meta.base_legal}</strong>
            </p>
            <p>
              Última atualização dos dados: <strong>{researchData.meta.ultima_atualizacao}</strong>
            </p>
          </div>

          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            {researchData.bancos.map((banco) => (
              <SourceGroup
                key={banco.nome_do_banco}
                bank={banco.nome_do_banco}
                sources={banco.fontes}
              />
            ))}
          </div>

          <div className="rounded-lg bg-muted/50 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              <strong>Transparência:</strong> O arquivo completo de pesquisa com todos os
              dados brutos, histórico de lucros e regras detalhadas está disponível no{" "}
              <a
                href="https://github.com/JohnPitter/meu-plr/blob/main/docs/bank-plr-research.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                repositório do projeto
              </a>.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
