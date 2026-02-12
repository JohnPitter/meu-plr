import type { PlrCalculation } from "../../domain/entities/PlrCalculation.ts";
import type { IPlrCalculator } from "../../domain/interfaces/IPlrCalculator.ts";
import type { ITaxCalculator } from "../../domain/interfaces/ITaxCalculator.ts";
import type { ILogger } from "../../domain/interfaces/ILogger.ts";
import { Salary } from "../../domain/value-objects/Salary.ts";
import { WorkPeriod } from "../../domain/value-objects/WorkPeriod.ts";
import { getBankInfo, type BankId } from "../../domain/value-objects/Bank.ts";
import type { PlrInput } from "../dtos/PlrInput.ts";
import type { PlrResult } from "../dtos/PlrResult.ts";
const CONTRIBUICAO_SINDICAL_RATE = 0.015;

export class CalculatePlr {
  readonly calculatorFactory: (bankId: BankId) => IPlrCalculator;
  readonly taxCalculator: ITaxCalculator;
  readonly logger: ILogger;

  constructor(
    calculatorFactory: (bankId: BankId) => IPlrCalculator,
    taxCalculator: ITaxCalculator,
    logger: ILogger,
  ) {
    this.calculatorFactory = calculatorFactory;
    this.taxCalculator = taxCalculator;
    this.logger = logger;
  }

  execute(input: PlrInput): PlrResult {
    this.logger.info("Iniciando calculo PLR", { bankId: input.bankId, salario: input.salario });

    const salary = new Salary(input.salario);
    const period = new WorkPeriod(input.mesesTrabalhados);
    const bankInfo = getBankInfo(input.bankId);
    const calculator = this.calculatorFactory(input.bankId);

    const breakdown = calculator.getBreakdown(salary.value, period.months);

    const totalBruto = breakdown.totalAntecipacao + breakdown.totalExercicio + breakdown.programaComplementar;

    const tax = this.taxCalculator.calculate(totalBruto);

    const contribuicaoSindical = input.incluirContribuicaoSindical
      ? Math.round(totalBruto * CONTRIBUICAO_SINDICAL_RATE * 100) / 100
      : 0;

    const totalLiquido = Math.round((totalBruto - tax.irrf - contribuicaoSindical) * 100) / 100;

    // Calculo por parcela: se o usuario informou o bruto da 1a parcela,
    // calcula o IRRF diferencial para a 2a parcela
    const valorPrimeiraParcela = input.valorPrimeiraParcela ?? null;
    let irrfPrimeiraParcela = 0;
    let brutoSegundaParcela = 0;
    let irrfSegundaParcela = 0;
    let liquidoSegundaParcela = 0;

    if (valorPrimeiraParcela != null && valorPrimeiraParcela > 0) {
      // IRRF distribuido proporcionalmente (metodo usado pelos bancos)
      irrfPrimeiraParcela = totalBruto > 0
        ? Math.min(tax.irrf, Math.round((tax.irrf * (valorPrimeiraParcela / totalBruto)) * 100) / 100)
        : 0;
      brutoSegundaParcela = Math.round((totalBruto - valorPrimeiraParcela) * 100) / 100;
      irrfSegundaParcela = Math.max(0, Math.round((tax.irrf - irrfPrimeiraParcela) * 100) / 100);
      const sindical2a = input.incluirContribuicaoSindical
        ? Math.round(brutoSegundaParcela * CONTRIBUICAO_SINDICAL_RATE * 100) / 100
        : 0;
      liquidoSegundaParcela = Math.round((brutoSegundaParcela - irrfSegundaParcela - sindical2a) * 100) / 100;
    }

    const calculation: PlrCalculation = {
      bankId: input.bankId,
      bankName: bankInfo.name,
      salario: salary.value,
      mesesTrabalhados: period.months,
      valorPrimeiraParcela,
      totalBruto,
      irrf: tax.irrf,
      irrfPrimeiraParcela,
      contribuicaoSindical,
      totalLiquido,
      brutoSegundaParcela,
      irrfSegundaParcela,
      liquidoSegundaParcela,
      breakdown,
    };

    this.logger.info("Calculo PLR concluido", {
      bankId: input.bankId,
      totalBruto,
      totalLiquido,
      ...(valorPrimeiraParcela != null && { liquidoSegundaParcela }),
    });

    return { calculation, tax };
  }
}
