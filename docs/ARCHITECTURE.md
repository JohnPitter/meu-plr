# Architecture

## Clean Architecture Layers

```
Domain (entities, VOs, interfaces)
  |
Application (use cases, DTOs)
  |
Infrastructure (calculators, tax, logging)
  |
Presentation (React components, hooks)
```

### Domain Layer
- `entities/PlrCalculation.ts` — Core calculation result structure
- `value-objects/Bank.ts` — Bank enum and metadata
- `value-objects/Salary.ts` — Salary validation (positive number)
- `value-objects/WorkPeriod.ts` — Work period in months (1-12), proportion
- `interfaces/IPlrCalculator.ts` — Calculator contract
- `interfaces/ITaxCalculator.ts` — Tax calculator contract
- `errors/` — Domain-specific errors

### Application Layer
- `use-cases/CalculatePlr.ts` — Orchestrates calculator + IRRF + proportion
- `dtos/PlrInput.ts` — Input DTO
- `dtos/PlrResult.ts` — Output DTO

### Infrastructure Layer
- `calculators/FenabanCalculator.ts` — Generic FENABAN rule
- `calculators/ItauCalculator.ts` — Itau (FENABAN + PCR)
- `calculators/SantanderCalculator.ts` — Santander (FENABAN + PPRS)
- `calculators/BradescoCalculator.ts` — Bradesco (FENABAN + PLR Social)
- `calculators/BbCalculator.ts` — BB (FENABAN + Modulo BB)
- `calculators/CaixaCalculator.ts` — Caixa (FENABAN + PLR Social + 3x cap)
- `calculators/CalculatorFactory.ts` — Factory pattern
- `tax/IrrfCalculator.ts` — Exclusive PLR tax table
- `logging/ConsoleLogger.ts` — Structured JSON logging

### Presentation Layer
- React components with shadcn/ui
- Custom hooks for calculation, history, theme
- Zod validation for form inputs
