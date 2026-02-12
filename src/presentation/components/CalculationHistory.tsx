import { History, Trash2, X, RotateCcw } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { formatCurrency } from "../lib/utils.ts";
import type { HistoryEntry } from "../hooks/useHistory.ts";

const PARCELA_SHORT: Record<string, string> = {
  total: "Total",
  primeira: "1a",
  segunda: "2a",
};

interface CalculationHistoryProps {
  entries: HistoryEntry[];
  onRemove: (index: number) => void;
  onClear: () => void;
  onSelect: (entry: { bankId: string; salario: number; meses: number; parcela?: string }) => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "agora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min atras`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

export function CalculationHistory({ entries, onRemove, onClear, onSelect }: CalculationHistoryProps) {
  if (entries.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <History className="h-4 w-4 text-muted-foreground" />
          Historico
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-7 text-xs text-muted-foreground">
          <Trash2 className="mr-1 h-3 w-3" />
          Limpar
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div
              key={entry.calculatedAt}
              className="group flex items-center justify-between rounded-lg border bg-card p-3 text-sm transition-colors hover:bg-muted/50 cursor-pointer"
              onClick={() => onSelect({ bankId: entry.bankId, salario: entry.salario, meses: entry.meses, parcela: entry.parcela })}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{entry.bankName}</span>
                  <Badge variant="outline" className="shrink-0 text-[10px] px-1.5 py-0">
                    {entry.meses}m
                  </Badge>
                  {entry.parcela && entry.parcela !== "total" && (
                    <Badge variant="outline" className="shrink-0 text-[10px] px-1.5 py-0">
                      {PARCELA_SHORT[entry.parcela] ?? entry.parcela}
                    </Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground">{timeAgo(entry.calculatedAt)}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Salario: {formatCurrency(entry.salario)}</span>
                  <span className="font-medium text-foreground">{formatCurrency(entry.totalLiquido)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <span className="hidden group-hover:inline-flex items-center gap-1 text-[10px] text-primary mr-1">
                  <RotateCcw className="h-3 w-3" />
                  Recalcular
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
