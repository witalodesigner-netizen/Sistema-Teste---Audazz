"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema básico para validação (o schema completo será criado no Item 3)
const MemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
})

export async function createClientMember(clientId: string, data: z.infer<typeof MemberSchema>) {
  try {
    const member = await db.clientMember.create({
      data: {
        ...data,
        clientId,
        status: "pendente",
        password: "TEMPORARY_PASSWORD", // Será definida pelo cliente no aceite do convite
        permissions: {
          create: {} // Default permissions
        }
      }
    })

    // Lógica de convite seria disparada aqui (Item 2 - Resend)
    
    revalidatePath(`/clientes/${clientId}`)
    return { success: true, data: member }
  } catch (error) {
    console.error("Error creating member:", error)
    return { success: false, error: "Falha ao criar membro" }
  }
}

export async function updateMemberPermissions(memberId: string, permissions: any) {
  try {
    await db.clientMemberPermission.update({
      where: { memberId },
      data: permissions
    })

    const member = await db.clientMember.findUnique({ where: { id: memberId } })
    if (member) revalidatePath(`/clientes/${member.clientId}`)
    
    return { success: true }
  } catch (error) {
    return { success: false, error: "Falha ao atualizar permissões" }
  }
}

export async function deleteClientMember(memberId: string) {
  try {
    const member = await db.clientMember.update({
      where: { id: memberId },
      data: { deletedAt: new Date(), status: "inativo" }
    })

    revalidatePath(`/clientes/${member.clientId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Falha ao remover membro" }
  }
}
