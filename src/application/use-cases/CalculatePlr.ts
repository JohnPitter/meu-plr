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
    this.logger.info("Iniciando calculo PLR", { bankId: input.bankId, salario: input.salario, parcela: input.parcela });

    const salary = new Salary(input.salario);
    const period = new WorkPeriod(input.mesesTrabalhados);
    const bankInfo = getBankInfo(input.bankId);
    const calculator = this.calculatorFactory(input.bankId);
    const parcela = input.parcela ?? "total";

    const breakdown = calculator.getBreakdown(salary.value, period.months);

    const plrAnual = breakdown.totalAntecipacao + breakdown.totalExercicio + breakdown.programaComplementar;

    let totalBruto: number;
    let irrf: number;

    if (parcela === "primeira") {
      totalBruto = breakdown.totalAntecipacao;
      irrf = this.taxCalculator.calculate(totalBruto).irrf;
    } else if (parcela === "segunda") {
      totalBruto = breakdown.totalExercicio + breakdown.programaComplementar;
      const irrfAnual = this.taxCalculator.calculate(plrAnual).irrf;
      const irrfPrimeira = this.taxCalculator.calculate(breakdown.totalAntecipacao).irrf;
      irrf = Math.max(0, Math.round((irrfAnual - irrfPrimeira) * 100) / 100);
    } else {
      totalBruto = plrAnual;
      irrf = this.taxCalculator.calculate(totalBruto).irrf;
    }

    const tax = this.taxCalculator.calculate(parcela === "segunda" ? plrAnual : totalBruto);

    const contribuicaoSindical = input.incluirContribuicaoSindical
      ? Math.round(totalBruto * CONTRIBUICAO_SINDICAL_RATE * 100) / 100
      : 0;

    const totalLiquido = Math.round((totalBruto - irrf - contribuicaoSindical) * 100) / 100;

    const calculation: PlrCalculation = {
      bankId: input.bankId,
      bankName: bankInfo.name,
      salario: salary.value,
      mesesTrabalhados: period.months,
      parcela,
      totalBruto,
      irrf,
      contribuicaoSindical,
      totalLiquido,
      breakdown,
    };

    this.logger.info("Calculo PLR concluido", {
      bankId: input.bankId,
      parcela,
      totalBruto,
      totalLiquido,
    });

    return { calculation, tax };
  }
}
