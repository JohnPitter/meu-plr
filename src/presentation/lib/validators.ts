import { z } from "zod/v4";
import { BANKS } from "../../domain/value-objects/Bank.ts";

const bankValues = Object.values(BANKS) as [string, ...string[]];

export const plrFormSchema = z.object({
  bankId: z.enum(bankValues, { message: "Selecione um banco" }),
  salario: z.number({ error: "Informe o salario" }).positive("Salario deve ser positivo"),
  mesesTrabalhados: z.number().int().min(1, "Minimo 1 mes").max(12, "Maximo 12 meses"),
  incluirContribuicaoSindical: z.boolean(),
});

export type PlrFormData = z.infer<typeof plrFormSchema>;
