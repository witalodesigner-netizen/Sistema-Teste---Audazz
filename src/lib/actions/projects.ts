'use server'

import { adminDb } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { getPortalSession } from '@/lib/security/session'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Esquema de validao para projetos.
 */
const ProjectSchema = z.object({
  agencyId: z.string().min(1),
  clientId: z.string().min(1),
  clientName: z.string(),
  name: z.string().min(3, "Nome do projeto deve ter pelo menos 3 caracteres"),
  status: z.string().default('briefing'),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']).default('media'),
  deadline: z.string().optional()
})

/**
 * Cria um novo projeto no Firestore.
 */
export async function createProjectAction(data: z.infer<typeof ProjectSchema>) {
  const session = await getPortalSession()
  if (!session || !session.uid) return { success: false, error: 'Não autorizado' }
  const userId = session.uid
  const userEmail = session.email || 'admin@audazz.com'

  try {
    const validated = ProjectSchema.parse(data)
    const projectRef = adminDb.collection('agencies').doc(validated.agencyId).collection('projects').doc()

    const newProject = {
      ...validated,
      deadline: validated.deadline ? new Date(validated.deadline) : null,
      responsibleId: userId,
      responsibleName: userEmail,
      team: [{ 
        userId, 
        userName: userEmail, 
        role: 'owner' 
      }],
      totalApprovals: 0,
      totalRevisions: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null
    }

    await projectRef.set(newProject)

    await logAudit({
      agencyId: validated.agencyId,
      userId,
      userEmail: userEmail,
      userRole: 'admin',
      acao: 'CREATE',
      recurso: 'PROJECT',
      recursoId: projectRef.id,
      dadosDepois: newProject,
      sucesso: true
    })

    revalidatePath('/projects')
    return { success: true, id: projectRef.id }
  } catch (error: any) {
    console.error("Erro ao criar projeto:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Atualiza o status de um projeto.
 */
export async function updateProjectStatusAction(agencyId: string, projectId: string, newStatus: string) {
  const session = await getPortalSession()
  if (!session || !session.uid) return { success: false, error: 'Não autorizado' }
  const userId = session.uid
  const userEmail = session.email || 'admin@audazz.com'

  try {
    const projectRef = adminDb.collection('agencies').doc(agencyId).collection('projects').doc(projectId)
    
    await projectRef.update({
      status: newStatus,
      updatedAt: FieldValue.serverTimestamp()
    })

    await logAudit({
      agencyId,
      userId,
      userEmail: userEmail,
      userRole: 'admin',
      acao: 'UPDATE_STATUS',
      recurso: 'PROJECT',
      recursoId: projectId,
      dadosDepois: { status: newStatus },
      sucesso: true
    })

    revalidatePath('/projects')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
