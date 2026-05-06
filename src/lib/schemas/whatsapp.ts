import { z } from "zod";

/**
 * Schemas de Validação Zod - WhatsApp
 */

export const whatsappConfigSchema = z.object({
  id: z.string().optional(),
  modalidade: z.enum(["evolution", "meta"]),
  
  // Evolution
  evolutionUrl: z.string().url("URL inválida").optional(),
  evolutionApiKey: z.string().optional(),
  evolutionInstance: z.string().optional(),
  
  // Meta
  metaPhoneNumberId: z.string().optional(),
  metaWabaId: z.string().optional(),
  metaAccessToken: z.string().optional(),
  metaWebhookToken: z.string().optional(),
  
  // Gerais
  numeroDisplay: z.string().optional(),
  horarioInicio: z.string().default("08:00"),
  horarioFim: z.string().default("20:00"),
  apenasUteis: z.boolean().default(true),
  ativo: z.boolean().default(false),
  
  // Notificações
  notifAprovacao: z.boolean().default(true),
  notifFatura: z.boolean().default(true),
  notifPagamento: z.boolean().default(true),
}).strict();

export const whatsappTemplateSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  categoria: z.string().min(1, "Categoria obrigatória"),
  conteudo: z.string().min(10, "Conteúdo muito curto"),
  variaveis: z.array(z.string()).default([]),
}).strict();
