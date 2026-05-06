import { z } from "zod";

/**
 * Schemas de Validação Zod - Asaas
 */

export const asaasConfigSchema = z.object({
  id: z.string().optional(),
  apiKey: z.string().min(10, "API Key inválida"),
  environment: z.enum(["sandbox", "production"]),
  webhookToken: z.string().min(5, "Token do Webhook deve ser seguro"),
  syncClientes: z.boolean().default(true),
  syncCobr: z.boolean().default(true),
  ativo: z.boolean().default(false),
}).strict();

export const asaasCustomerSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido").optional(),
  phone: z.string().optional(),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido").max(14).optional(),
  postalCode: z.string().optional(),
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  complement: z.string().optional(),
  province: z.string().optional(),
  notificationDisabled: z.boolean().default(false),
}).strict();

export const asaasPaymentSchema = z.object({
  customer: z.string().min(1, "Cliente obrigatório"),
  billingType: z.enum(["BOLETO", "PIX", "CREDIT_CARD", "UNDEFINED"]),
  value: z.number().positive("Valor deve ser positivo"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)"),
  description: z.string().optional(),
  externalReference: z.string().optional(),
}).strict();
