import { z } from "zod";

/**
 * Schemas de Validação Zod - RD Station
 */

export const rdStationConfigSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().min(1, "Client ID obrigatório").optional(),
  clientSecret: z.string().min(1, "Client Secret obrigatório").optional(),
  tipo: z.enum(["marketing", "crm", "ambos"]),
  syncContatos: z.boolean().default(true),
  syncFunil: z.boolean().default(true),
  mapeamentoFunil: z.any().optional(), // Objeto dinâmico
  mapeamentoCampos: z.any().optional(), // Objeto dinâmico
  ativo: z.boolean().default(false),
}).strict();

export const rdStationLeadSchema = z.object({
  email: z.string().email("E-mail inválido"),
  nome: z.string().optional(),
  telefone: z.string().optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  origem: z.string().optional(),
  tags: z.array(z.string()).default([]),
  estagio: z.string().optional(),
}).strict();
