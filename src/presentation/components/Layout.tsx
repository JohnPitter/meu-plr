import { DollarSign, Moon, Sun } from "lucide-react";
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
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">Meu PLR</span>
              <span className="text-[10px] leading-none text-muted-foreground">CCT FENABAN 2024/2026</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
            <p>Baseado na CCT FENABAN 2024/2026 (exercício 2025)</p>
            <p>Valores de referência. Consulte seu holerite para valores exatos.</p>
            <p>
              Esta aplicação não armazena nenhum dado pessoal. Todos os cálculos são feitos localmente no seu navegador.
              {" "}<a href="https://github.com/JohnPitter/meu-plr" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Código fonte</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
