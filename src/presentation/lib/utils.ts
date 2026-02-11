import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const cents = BigInt(digits);
  const intPart = (cents / 100n).toString();
  const decPart = (cents % 100n).toString().padStart(2, "0");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted},${decPart}`;
}

export function parseCurrencyInput(masked: string): number {
  if (!masked) return 0;
  const digits = masked.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}
