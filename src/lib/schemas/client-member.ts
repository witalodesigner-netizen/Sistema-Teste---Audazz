import { z } from "zod"

export const clientMemberSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  jobTitle: z.string().min(1, "Cargo é obrigatório"),
  phone: z.string().optional(),
  role: z.enum(["DONO", "GESTOR", "VISUALIZADOR"], {
    required_error: "Selecione um nível de acesso",
  }),
})

export const inviteMemberSchema = z.object({
  email: z.string().email("E-mail inválido"),
  role: z.enum(["DONO", "GESTOR", "VISUALIZADOR"]),
})

export const memberPasswordSchema = z.object({
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export type ClientMemberValues = z.infer<typeof clientMemberSchema>
export type InviteMemberValues = z.infer<typeof inviteMemberSchema>
