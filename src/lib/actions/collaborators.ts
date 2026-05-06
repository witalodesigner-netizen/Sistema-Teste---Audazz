"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createCollaborator(data: any) {
  try {
    const { financeiro, ...rest } = data
    
    const collaborator = await db.collaborator.create({
      data: {
        ...rest,
        financeiro: {
          create: financeiro
        },
        onboarding: {
          create: {
            tarefas: {
              create: [
                { titulo: "Enviar documentos", ordem: 1 },
                { titulo: "Assinar contrato", ordem: 2 },
                { titulo: "Configurar ferramentas", ordem: 3 }
              ]
            }
          }
        }
      }
    })

    revalidatePath("/operacoes/colaboradores")
    return { success: true, data: collaborator }
  } catch (error) {
    console.error("Error creating collaborator:", error)
    return { success: false, error: "Falha ao cadastrar colaborador" }
  }
}

export async function updateCollaborator(id: string, data: any) {
  try {
    const { financeiro, ...rest } = data

    await db.collaborator.update({
      where: { id },
      data: {
        ...rest,
        financeiro: {
          update: financeiro
        }
      }
    })

    revalidatePath(`/operacoes/colaboradores/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Falha ao atualizar colaborador" }
  }
}

export async function registerAbsence(collaboratorId: string, data: any) {
  try {
    await db.collaboratorAusencia.create({
      data: {
        ...data,
        collaboratorId,
        status: "pendente"
      }
    })

    revalidatePath(`/operacoes/colaboradores/${collaboratorId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Falha ao registrar ausência" }
  }
}

export async function allocateProject(collaboratorId: string, data: any) {
  try {
    await db.collaboratorAlocacao.create({
      data: {
        ...data,
        collaboratorId
      }
    })

    revalidatePath(`/operacoes/colaboradores/${collaboratorId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Falha ao alocar projeto" }
  }
}
