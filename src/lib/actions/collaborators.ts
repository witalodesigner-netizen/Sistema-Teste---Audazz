'use server'

import { adminDb } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { encrypt } from '@/lib/security/crypto'
import { revalidatePath } from 'next/cache'
import { auth, currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Esquema de validao para colaboradores.
 * Inclui campos sensveis que sero criptografados antes da persistncia.
 */
const CollaboratorSchema = z.object({
  agencyId: z.string().min(1),
  userId: z.string().min(1), // ID do Clerk para sincronizao
  name: z.string().min(2),
  emailProfissional: z.string().email(),
  cargo: z.string().min(1),
  departamento: z.string().min(1),
  telefone: z.string().optional(),
  cpf: z.string().optional(),
  salarioMensal: z.number().optional(),
  valorHora: z.number().optional(),
  chavePix: z.string().optional()
})

/**
 * Cria ou atualiza um colaborador com criptografia AES-256-GCM nos dados sensveis.
 */
export async function upsertCollaboratorAction(data: z.infer<typeof CollaboratorSchema>) {
  const { userId: adminId } = await auth()
  const adminUser = await currentUser()
  
  if (!adminId || !adminUser) {
    return { success: false, error: 'No autorizado' }
  }

  try {
    const validated = CollaboratorSchema.parse(data)
    const collabRef = adminDb.collection('agencies').doc(validated.agencyId).collection('collaborators').doc(validated.userId)

    const docData: any = {
      agencyId: validated.agencyId,
      userId: validated.userId,
      name: validated.name,
      emailProfissional: validated.emailProfissional,
      cargo: validated.cargo,
      departamento: validated.departamento,
      telefone: validated.telefone || null,
      ativo: true,
      updatedAt: FieldValue.serverTimestamp()
    }

    // Criptografia de dados sensveis (apenas se fornecidos)
    if (validated.cpf) docData.cpfEncrypted = encrypt(validated.cpf)
    if (validated.salarioMensal) docData.salarioMensalEncrypted = encrypt(validated.salarioMensal.toString())
    if (validated.valorHora) docData.valorHoraEncrypted = encrypt(validated.valorHora.toString())
    if (validated.chavePix) docData.chavePixEncrypted = encrypt(validated.chavePix)

    // Se for novo, adiciona data de criao
    const snapshot = await collabRef.get()
    if (!snapshot.exists()) {
      docData.createdAt = FieldValue.serverTimestamp()
      docData.deletedAt = null
    }

    await collabRef.set(docData, { merge: true })

    await logAudit({
      agencyId: validated.agencyId,
      userId: adminId,
      userEmail: adminUser.emailAddresses[0].emailAddress,
      userRole: 'admin',
      acao: snapshot.exists() ? 'UPDATE' : 'CREATE',
      recurso: 'COLLABORATOR',
      recursoId: validated.userId,
      sucesso: true
    })

    revalidatePath('/colaboradores')
    return { success: true }
  } catch (error: any) {
    console.error("Erro na Action Collaborator:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Registra uma ausncia para o colaborador.
 */
export async function registerAbsenceAction(collaboratorId: string, data: any) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'No autorizado' }

  try {
    const agencyId = "audazz-nexus"
    const absenceRef = adminDb
      .collection('agencies')
      .doc(agencyId)
      .collection('collaborators')
      .doc(collaboratorId)
      .collection('absences')
      .doc()

    await absenceRef.set({
      ...data,
      createdAt: FieldValue.serverTimestamp()
    })

    revalidatePath('/colaboradores')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Aloca um colaborador a um projeto.
 */
export async function allocateProjectAction(collaboratorId: string, data: any) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'No autorizado' }

  try {
    const agencyId = "audazz-nexus"
    const allocationRef = adminDb
      .collection('agencies')
      .doc(agencyId)
      .collection('collaborators')
      .doc(collaboratorId)
      .collection('allocations')
      .doc()

    await allocationRef.set({
      ...data,
      allocatedAt: FieldValue.serverTimestamp()
    })

    revalidatePath('/colaboradores')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
