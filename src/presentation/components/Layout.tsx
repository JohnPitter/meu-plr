import { Moon, Sun } from "lucide-react";
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
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">meu-plr</span>
              <span className="text-[10px] leading-none text-muted-foreground">CCT FENABAN 2024/2026</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
            <p>Baseado na CCT FENABAN 2024/2026 (exercicio 2025)</p>
            <p>Valores de referencia. Consulte seu holerite para valores exatos.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
