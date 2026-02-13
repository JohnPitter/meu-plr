import { useState, useCallback } from "react";

export interface HistoryEntry {
  bankId: string;
  bankName: string;
  salario: number;
  meses: number;
  incluirContribuicaoSindical: boolean;
  totalBruto: number;
  totalLiquido: number;
  calculatedAt: number;
}

const STORAGE_KEY = "meu-plr-history";
const MAX_ENTRIES = 20;

function loadHistory(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  const addEntry = useCallback((entry: Omit<HistoryEntry, "calculatedAt">) => {
    setHistory((prev) => {
      const updated = [{ ...entry, calculatedAt: Date.now() }, ...prev].slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeEntry = useCallback((index: number) => {
    setHistory((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
