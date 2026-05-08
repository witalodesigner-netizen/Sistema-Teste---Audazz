import { z } from "zod"

// ETAPA 1: Dados Pessoais
export const collaboratorPersonalSchema = z.object({
  avatarUrl: z.string().optional(),
  nome: z.string().min(3, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14),
  dataNascimento: z.date().optional(),
  emailPessoal: z.string().email("E-mail pessoal inválido").or(z.literal("")).optional(),
  emailProfissional: z.string().email("E-mail profissional inválido").or(z.literal("")).optional(),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  genero: z.string().optional(),
  contatoEmergencia: z.string().optional(),
  telefoneEmergencia: z.string().optional(),
})

// ETAPA 2: Dados Profissionais
export const collaboratorProfessionalSchema = z.object({
  cargo: z.string().min(1, "Cargo é obrigatório"),
  departamento: z.enum(["Design", "Tráfego Pago", "Social Media", "Desenvolvimento", "Gestão de Projetos", "Atendimento", "Financeiro", "Outro"] as const),
  vinculo: z.enum(["CLT", "PJ", "Freelancer", "Estágio", "Sócio"] as const),
  senioridade: z.enum(["Júnior", "Pleno", "Sênior", "Especialista", "Líder"] as const).optional().default("Pleno"),
  dataEntrada: z.date().optional(),
  cargaHoraria: z.number().min(1).max(168).optional().default(40),
  horarioInicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm").optional().default("09:00"),
  horarioFim: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm").optional().default("18:00"),
  diasTrabalho: z.array(z.string()).optional().default(["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]),
  especialidades: z.array(z.string()).optional().default([]),
  bio: z.string().max(1000).optional(),
})

// ETAPA 3: Dados Financeiros
export const collaboratorFinancialSchema = z.object({
  tipoRemuneracao: z.enum(["Salário fixo", "Por hora", "Por projeto", "Misto"] as const).optional().default("Salário fixo"),
  salarioMensal: z.preprocess((val) => (val === "" || Number.isNaN(val) ? undefined : val), z.number().optional()),
  valorHora: z.preprocess((val) => (val === "" || Number.isNaN(val) ? undefined : val), z.number().optional()),
  chavePix: z.string().optional(),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  cnpjPj: z.string().optional(),
  beneficios: z.array(z.string()).optional().default([]),
  observacoes: z.string().optional(),
})

// ETAPA 4: Acesso
export const collaboratorAccessSchema = z.object({
  role: z.enum(["admin", "gestor", "criativo"] as const),
  podeSerAlocado: z.boolean().default(true),
  recebeTasksSistema: z.boolean().default(true),
  ativo: z.boolean().default(true),
})

// Schema Completo (Wizard)
export const collaboratorFullSchema = z.object({
  ...collaboratorPersonalSchema.shape,
  ...collaboratorProfessionalSchema.shape,
  ...collaboratorFinancialSchema.shape,
  ...collaboratorAccessSchema.shape,
})

export type CollaboratorPersonalValues = z.infer<typeof collaboratorPersonalSchema>
export type CollaboratorProfessionalValues = z.infer<typeof collaboratorProfessionalSchema>
export type CollaboratorFinancialValues = z.infer<typeof collaboratorFinancialSchema>
export type CollaboratorAccessValues = z.infer<typeof collaboratorAccessSchema>
export type CollaboratorFullValues = z.infer<typeof collaboratorFullSchema>
