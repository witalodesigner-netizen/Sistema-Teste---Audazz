'use server'

import { adminDb } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { auth, currentUser } from '@clerk/nextjs/server'
import crypto from 'crypto'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Cria uma nova solicitao de aprovao para o cliente.
 * Gera um token nico para acesso sem login do portal (link pblico).
 */
export async function createApprovalAction(agencyId: string, projectId: string, data: any) {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId || !user) return { success: false, error: 'No autorizado' }

  try {
    // Gera um token seguro de 64 caracteres para o link pblico
    const token = crypto.randomBytes(32).toString('hex')
    const approvalRef = adminDb.collection('agencies').doc(agencyId).collection('approvals').doc()

    const newApproval = {
      ...data,
      projectId,
      agencyId,
      token,
      version: data.version || 1,
      status: 'pendente',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null
    }

    await approvalRef.set(newApproval)

    await logAudit({
      agencyId,
      userId,
      userEmail: user.emailAddresses[0].emailAddress,
      userRole: 'admin',
      acao: 'CREATE',
      recurso: 'APPROVAL',
      recursoId: approvalRef.id,
      sucesso: true
    })

    revalidatePath(`/projects/${projectId}`)
    return { success: true, id: approvalRef.id, token }
  } catch (error: any) {
    console.error("Erro ao criar aprovao:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Registra a resposta do cliente a uma aprovao.
 */
export async function respondToApprovalAction(agencyId: string, approvalId: string, response: { 
  status: string, 
  feedback?: string, 
  name: string, 
  email: string 
}) {
  try {
    const approvalRef = adminDb.collection('agencies').doc(agencyId).collection('approvals').doc(approvalId)
    
    const updateData = {
      status: response.status,
      generalFeedback: response.feedback || null,
      respondedByName: response.name,
      respondedByEmail: response.email,
      respondedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }

    await approvalRef.update(updateData)

    // Nota: Audit log aqui  opcional pois  uma ao de cliente, 
    // mas podemos registrar como sistema.
    
    revalidatePath('/approvals')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
