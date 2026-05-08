'use server'

import { adminDb } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { getPortalSession } from '@/lib/security/session'
import crypto from 'crypto'
import { FieldValue } from 'firebase-admin/firestore'

export async function createApprovalAction(agencyId: string, projectId: string, data: any) {
  const session = await getPortalSession()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
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
      userId: session.uid,
      userEmail: session.email || 'sistema@audazz.com',
      userRole: 'admin',
      acao: 'CREATE',
      recurso: 'APPROVAL',
      recursoId: approvalRef.id,
      sucesso: true
    })

    revalidatePath(`/projects/${projectId}`)
    return { success: true, id: approvalRef.id, token }
  } catch (error: any) {
    console.error("Erro ao criar aprovação:", error)
    return { success: false, error: error.message }
  }
}

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
    
    revalidatePath('/approvals')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
