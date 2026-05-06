import { z } from "zod"

export const portalConfigSchema = z.object({
  ativo: z.boolean().default(false),
  slug: z.string().min(3, "O slug deve ter pelo menos 3 caracteres").regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hifens"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  corDestaque: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida").optional(),
  mensagemBoasVindas: z.string().max(500, "Máximo de 500 caracteres").optional(),
  mostrarAprovacoes: z.boolean().default(true),
  mostrarMateriais: z.boolean().default(true),
  mostrarRelatorios: z.boolean().default(true),
  mostrarSolicitacoes: z.boolean().default(true),
  mostrarFinanceiro: z.boolean().default(false),
  webhookUrl: z.string().url().optional().or(z.literal("")),
})

export const materialSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  categoria: z.string().min(1, "Selecione uma categoria"),
  fileUrl: z.string().url("URL de arquivo inválida"),
  fileType: z.string(),
  fileSize: z.number(),
})

export const solicitacaoSchema = z.object({
  titulo: z.string().min(5, "Título deve ser mais descritivo"),
  descricao: z.string().min(10, "Forneça mais detalhes na descrição"),
  tipo: z.string().min(1, "Selecione o tipo de solicitação"),
  prioridade: z.enum(["baixa", "normal", "urgente"]),
})

export type PortalConfigValues = z.infer<typeof portalConfigSchema>
export type MaterialValues = z.infer<typeof materialSchema>
export type SolicitacaoValues = z.infer<typeof solicitacaoSchema>
