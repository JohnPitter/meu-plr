# PLR Rules — CCT FENABAN 2024/2026 (exercicio 2025)

Source: Sindicato dos Bancarios de SP / FENABAN. Reajuste 5,68% (INPC 5,05% + 0,6% ganho real).

## Anticipation (1st Installment - September)

| Item | Value |
|------|-------|
| Basic Rule | 54% of salary + R$ 2.119,75 |
| Basic Rule Cap | R$ 11.371,44 |
| Additional Portion | R$ 3.668,29 |
| Payment Deadline | September 30 |

## Full Year PLR (2nd Installment - March)

| Item | Value |
|------|-------|
| Basic Rule | 90% of salary + R$ 3.532,92 |
| Basic Rule Cap | R$ 18.952,40 |
| Majoracao (profitable banks) | min(2,2 x salary, R$ 41.695,29) |
| Additional Portion | R$ 7.336,60 |
| Discount | Anticipation already paid |
| Payment Deadline | March 1 (following year) |

## Majoracao

When total basic rule paid by bank < 5% of net profit, individual values increase:
- Formula: min(2,2 x salary, R$ 41.695,29)
- Applies to: Itau, Santander, Bradesco, BTG Pactual (profitable banks)
- Does NOT apply to: BB, Caixa, Safra

## Bank-Specific Programs

| Bank | Program | Default Value |
|------|---------|---------------|
| Itau | PCR (Programa Complementar de Resultados) | R$ 4.299,86 (2o patamar) |
| Santander | PPRS (Programa Proprio de Resultados) | R$ 3.880,84 |
| Bradesco | PRB (Programa de Remuneracao Bradesco) | R$ 2.500,00 |
| Banco do Brasil | Modulo BB | R$ 3.500,00 (estimativa) |
| Caixa | PLR Social | R$ 3.200,00 (estimativa) |
| BTG Pactual | FENABAN + majoracao | - (bonus discricionario nao modelado) |
| Safra | Generic FENABAN only | - |

### Itau PCR tiers (ACT 2025/2026)

| ROE | Value |
|-----|-------|
| > 22,1% | R$ 4.299,86 (2o patamar) |
| <= 22,1% | R$ 3.908,05 (1o patamar) |

### Santander PPRS tiers (ACT 2024/2025, reajustados 2025)

| ROAE | Value (2024) | Value (2025) |
|------|-------------|-------------|
| < 13% | R$ 3.037,48 | R$ 3.210,04 |
| 13% - 15,5% | R$ 3.672,26 | R$ 3.880,84 (default) |
| > 15,5% | R$ 3.819,16 | R$ 4.036,10 |

Note: Calculator default uses tier 2 (ROAE 13-15,5%). PPE and PPG (area-specific) not modeled.

### Bradesco PRB tiers

| ROAE | Value |
|------|-------|
| >= 15,5% | R$ 1.000 |
| >= 17,0% | R$ 2.000 |
| >= 18,5% | R$ 2.500 (default) |

Note: Bradesco also has PPR Supera (2025) for sales roles, not modeled in calculator.

### Caixa specifics

- Anticipation formula: 50% of full year (vs 60% for private banks)
- Anticipation: 45% of salary + R$ 1.766,46 (cap R$ 9.476,20)
- Total PLR cap: 3x base salary

## Proportional PLR

- Pro-rata in twelfths (1/12 per month worked)
- Fraction >= 15 days = 1 twelfth

## IRRF Tax Table (Exclusive for PLR)

Lei 14.663/2023 (vigencia 2024+):

| Bracket | Rate | Deduction |
|---------|------|-----------|
| Up to R$ 7.640,80 | Exempt | - |
| R$ 7.640,81 to R$ 9.922,28 | 7,5% | R$ 573,06 |
| R$ 9.922,29 to R$ 13.167,00 | 15% | R$ 1.317,23 |
| R$ 13.167,01 to R$ 16.380,38 | 22,5% | R$ 2.304,76 |
| Above R$ 16.380,38 | 27,5% | R$ 3.123,78 |

## Union Contribution

- 1,5% of total PLR
