# meu-plr

Calculadora de PLR (Participacao nos Lucros e Resultados) para bancarios que atuam no Brasil, baseada na CCT FENABAN 2024/2026 (exercicio 2025).

[![CI](https://github.com/JohnPitter/meu-plr/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnPitter/meu-plr/actions/workflows/ci.yml)

| | |
|---|---|
| Stack | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 |
| Architecture | Clean Architecture |
| Tests | 56 unit tests (Vitest) |
| CI/CD | GitHub Actions |
| Deploy | GitHub Pages |
| License | MIT |

## Banks

| Bank | Program | Default Value |
|---|---|---|
| Itau Unibanco | PCR (Programa Complementar de Resultados) | R$ 4.096,42 |
| Santander | PPRS (Programa Proprio de Resultados) | R$ 3.880,84 |
| Bradesco | PRB (Programa de Remuneracao Bradesco) | R$ 2.500,00 |
| Banco do Brasil | Modulo BB | R$ 3.500,00 |
| Caixa Economica Federal | PLR Social | R$ 3.200,00 |
| Banco Safra | Regra FENABAN generica | - |

## Features

- Calculo completo de PLR (antecipacao + exercicio)
- Majoracao para bancos lucrativos (2,2x salario, teto R$ 41.695,29)
- Parcela adicional (teto R$ 7.336,60)
- Programas complementares por banco (valores hardcoded)
- PLR proporcional (1 a 12 meses)
- Calculo de IRRF com tabela exclusiva PLR
- Desconto de contribuicao sindical (1,5%)
- Mascara de moeda (R$) nos campos de valor
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
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run lint` | Lint code |

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [CCT Rules](docs/CCT-RULES.md)
- [Changelog](CHANGELOG.md)

## Disclaimer

Valores de referencia baseados na CCT FENABAN 2024/2026 (exercicio 2025). Consulte seu holerite e o sindicato para valores exatos. Esta ferramenta nao substitui orientacao profissional.
