"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updatePortalConfig(clientId: string, data: any) {
  try {
    await db.clientPortalConfig.upsert({
      where: { clientId },
      update: data,
      create: { ...data, clientId }
    })

    revalidatePath(`/clientes/${clientId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Falha ao salvar configurações" }
  }
}

export async function uploadMaterial(clientId: string, data: any) {
  try {
    const material = await db.clientMaterial.create({
      data: {
        ...data,
        clientId,
        uploadedBy: "Admin" // TODO: Pegar do Clerk session
      }
    })

    revalidatePath(`/clientes/${clientId}`)
    return { success: true, data: material }
  } catch (error) {
    return { success: false, error: "Falha ao enviar material" }
  }
}

export async function createSolicitacao(clientId: string, memberId: string, data: any) {
  try {
    const solicitacao = await db.clientSolicitacao.create({
      data: {
        ...data,
        clientId,
        memberId,
        status: "aberta"
      }
    })

    revalidatePath(`/portal/${clientId}/solicitacoes`)
    return { success: true, data: solicitacao }
  } catch (error) {
    return { success: false, error: "Falha ao criar solicitação" }
  }
}
