'use server'

import { adminDb, adminAuth } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { getPortalSession } from '@/lib/security/session'
import bcrypt from 'bcryptjs'
import { FieldValue } from 'firebase-admin/firestore'

export async function createClientMemberAction(agencyId: string, clientId: string, data: any) {
  const session = await getPortalSession()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const userRecord = await adminAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
      photoURL: data.avatarUrl || null
    })

    await adminAuth.setCustomUserClaims(userRecord.uid, {
      agencyId,
      clientId,
      role: data.role || 'VISUALIZADOR',
      isClientMember: true
    })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(data.password, salt)

    const memberRef = adminDb
      .collection('agencies')
      .doc(agencyId)
      .collection('clients')
      .doc(clientId)
      .collection('members')
      .doc(userRecord.uid)

    const memberData = {
      uid: userRecord.uid,
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || 'VISUALIZADOR',
      jobTitle: data.jobTitle || '',
      phone: data.phone || '',
      status: 'pendente',
      permissions: data.permissions || {
        verAprovacoes: true,
        aprovar: false,
        acessarMateriais: true
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null
    }

    await memberRef.set(memberData)

    await logAudit({
      agencyId,
      userId: session.uid,
      userEmail: session.email || 'sistema@audazz.com',
      userRole: 'admin',
      acao: 'CREATE_PORTAL_MEMBER',
      recurso: 'CLIENT_MEMBER',
      recursoId: userRecord.uid,
      sucesso: true
    })

    revalidatePath(`/clients/${clientId}`)
    return { success: true, uid: userRecord.uid }
    
  } catch (error: any) {
    console.error("Erro ao criar membro do portal:", error)
    return { success: false, error: error.message }
  }
}
