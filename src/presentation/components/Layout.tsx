import { Moon, Sun, Calculator } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { useTheme } from "../hooks/useTheme.ts";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">meu-plr</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Baseado na CCT FENABAN 2024/2025 - Sindicato dos Bancarios de SP</p>
        <p className="mt-1">Valores de referencia. Consulte seu holerite para valores exatos.</p>
      </footer>
    </div>
  );
}
