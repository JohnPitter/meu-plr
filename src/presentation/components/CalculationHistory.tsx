import { History, Trash2, X } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Badge } from "./ui/badge.tsx";
import { formatCurrency } from "../lib/utils.ts";
import type { HistoryEntry } from "../hooks/useHistory.ts";

interface CalculationHistoryProps {
  entries: HistoryEntry[];
  onRemove: (index: number) => void;
  onClear: () => void;
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

export function CalculationHistory({ entries, onRemove, onClear }: CalculationHistoryProps) {
  if (entries.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <History className="h-4 w-4" />
          Historico de Calculos
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="mr-1 h-3 w-3" />
          Limpar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div
              key={entry.calculatedAt}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.bankName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {entry.meses}/12
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Salario: {formatCurrency(entry.salario)} | Liquido: {formatCurrency(entry.totalLiquido)}
                </div>
                <div className="text-xs text-muted-foreground">{timeAgo(entry.calculatedAt)}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemove(i)} className="h-6 w-6">
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
