# meu-plr

Calculadora de PLR (Participacao nos Lucros e Resultados) para bancarios que atuam no Brasil, baseada nas Convencoes Coletivas de Trabalho (CCTs) da FENABAN / Sindicato dos Bancarios de SP.

| Item | Detail |
|------|--------|
| Stack | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| Architecture | Clean Architecture (Domain / Application / Infrastructure / Presentation) |
| Tests | 45 unit tests (Vitest) |
| CI/CD | GitHub Actions (lint, test, build) |
| License | MIT |

## Supported Banks

| Bank | Additional Program |
|------|-------------------|
| Itau Unibanco | PCR (Programa Complementar de Resultados) |
| Santander | PPRS (Programa Proprio de Resultados) |
| Bradesco | PLR Social (3% do lucro liquido) |
| Banco do Brasil | Modulo BB (4% do lucro liquido) |
| Caixa Economica Federal | PLR Social (4% do lucro liquido) |
| Banco Safra | Regra FENABAN generica |

## Features

- Calculo completo de PLR (antecipacao + exercicio)
- Programas complementares por banco
- PLR proporcional (1 a 12 avos)
- Calculo de IRRF com tabela exclusiva PLR
- Desconto de contribuicao sindical (1,5%)
- Detalhamento completo do calculo
- Historico de calculos (localStorage)
- Dark/light mode
- Design responsivo

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run lint` | Lint code |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [CCT Rules](docs/CCT-RULES.md)
- [Changelog](CHANGELOG.md)

## Disclaimer

Valores de referencia baseados na CCT FENABAN 2024/2025. Consulte seu holerite e o sindicato para valores exatos. Esta ferramenta nao substitui orientacao profissional.
