'use server'

import { adminDb, adminAuth } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { auth, currentUser } from '@clerk/nextjs/server'
import bcrypt from 'bcryptjs'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Cria um novo membro para o Portal do Cliente.
 * Integra Firebase Auth com Custom Claims e Firestore.
 */
export async function createClientMemberAction(agencyId: string, clientId: string, data: any) {
  const { userId: adminId } = await auth()
  const adminUser = await currentUser()
  
  if (!adminId || !adminUser) {
    return { success: false, error: 'No autorizado' }
  }

  try {
    // 1. Cria o usurio na camada de Autenticao do Firebase
    const userRecord = await adminAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
      photoURL: data.avatarUrl || null
    })

    // 2. Define Custom Claims para segurana via Security Rules (isolamento total)
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      agencyId,
      clientId,
      role: data.role || 'VISUALIZADOR',
      isClientMember: true
    })

    // 3. Hash da senha para redundncia (Bcrypt)
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(data.password, salt)

    // 4. Salva o perfil do membro no Firestore
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
      passwordHash, // Nunca usar AES para senhas, sempre hash unidirecional
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
      userId: adminId,
      userEmail: adminUser.emailAddresses[0].emailAddress,
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
