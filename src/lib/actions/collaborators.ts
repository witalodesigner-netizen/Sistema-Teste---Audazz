'use server'

import { adminDb, adminAuth } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { encrypt } from '@/lib/security/crypto'
import { revalidatePath } from 'next/cache'
import { getPortalSession } from '@/lib/security/session'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'
import { mapCpfToEmail, generateSystemPassword } from '@/lib/security/passwords'

/**
 * Cria um novo colaborador com acesso ao Portal (Firebase Auth)
 * O ID de acesso  o CPF e a senha  gerada automaticamente.
 */
export async function createCollaboratorAction(data: any) {
  const session = await getPortalSession()
  
  if (!session || !session.uid) {
    return { success: false, error: 'Não autorizado' }
  }
  const adminId = session.uid
  const adminEmail = session.email || 'admin@audazz.com'

  try {
    console.log("Starting createCollaboratorAction with data:", { ...data, cpf: '***' })
    const agencyId = "audazz-nexus"
    const generatedPassword = generateSystemPassword()
    
    if (!data.cpf) {
      console.error("CPF is missing in request data")
      return { success: false, error: 'CPF é obrigatório para criar acesso.' }
    }

    const virtualEmail = mapCpfToEmail(data.cpf)
    console.log("Generated virtual email:", virtualEmail)

    // 1. Cria o usuário no Firebase Auth
    console.log("Creating user in Firebase Auth...")
    const userRecord = await adminAuth.createUser({
      email: virtualEmail,
      password: generatedPassword,
      displayName: data.nome,
      phoneNumber: data.telefone ? `+55${data.telefone.replace(/\D/g, '')}` : undefined,
    }).catch(e => {
      console.error("Firebase Auth createUser failed:", e)
      throw e
    })

    // 2. Define Custom Claims
    console.log("Setting custom claims for UID:", userRecord.uid)
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      agencyId,
      role: data.role || 'criativo',
      isCollaborator: true,
      cpf: data.cpf.replace(/\D/g, '')
    }).catch(e => {
      console.error("Firebase Auth setCustomUserClaims failed:", e)
      throw e
    })

    // 3. Dados para o Firestore
    const docData: any = {
      uid: userRecord.uid,
      agencyId,
      name: data.nome,
      emailPessoal: data.emailPessoal || null,
      emailProfissional: data.emailProfissional,
      telefone: data.telefone || null,
      whatsapp: data.whatsapp || null,
      cpf: data.cpf,
      cargo: data.cargo,
      departamento: data.departamento,
      vinculo: data.vinculo || 'PJ',
      senioridade: data.senioridade || 'Pleno',
      dataEntrada: data.dataEntrada || new Date().toISOString(),
      cargaHoraria: data.cargaHoraria || 40,
      role: data.role || 'criativo',
      ativo: true,
      podeSerAlocado: data.podeSerAlocado ?? true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null
    }

    // Criptografia
    try {
      if (data.cpf) docData.cpfEncrypted = encrypt(data.cpf.replace(/\D/g, ''))
      if (data.salarioMensal) docData.salarioMensalEncrypted = encrypt(data.salarioMensal.toString())
      if (data.chavePix) docData.chavePixEncrypted = encrypt(data.chavePix)
    } catch (e) {
      console.error("Encryption failed:", e)
      // We continue even if encryption fails for non-critical fields, 
      // but CPF is critical. If CPF encryption fails, we might want to know.
    }

    // 4. Salva no Firestore
    console.log("Saving collaborator to Firestore...")
    const collabRef = adminDb
      .collection('agencies')
      .doc(agencyId)
      .collection('collaborators')
      .doc(userRecord.uid)

    await collabRef.set(docData).catch(e => {
      console.error("Firestore set failed:", e)
      throw e
    })

    // 5. Log de Auditoria
    console.log("Logging audit...")
    await logAudit({
      agencyId,
      userId: adminId,
      userEmail: adminEmail,
      userRole: 'admin',
      acao: 'CREATE_COLLABORATOR',
      recurso: 'COLLABORATOR',
      recursoId: userRecord.uid,
      sucesso: true
    }).catch(e => {
      console.warn("Audit logging failed (non-blocking):", e)
    })

    console.log("Revalidating path...")
    revalidatePath('/operacoes/colaboradores')
    
    return { 
      success: true, 
      uid: userRecord.uid, 
      password: generatedPassword,
      accessId: data.cpf
    }

  } catch (error: any) {
    console.error("CRITICAL ERROR in createCollaboratorAction:", error)
    if (error.code === 'auth/email-already-exists') {
      return { success: false, error: 'Este CPF já possui um acesso cadastrado.' }
    }
    return { success: false, error: error.message || "Erro interno ao processar admissão" }
  }
}

/**
 * Mantemos a função de upsert para compatibilidade ou atualizações simples via Clerk
 */
export async function upsertCollaboratorAction(data: any) {
  const session = await getPortalSession()
  if (!session || !session.uid) return { success: false, error: 'Não autorizado' }
  const adminId = session.uid

  try {
    const agencyId = data.agencyId || "audazz-nexus"
    const userId = data.userId || data.uid

    if (!userId) throw new Error("ID do usuário é obrigatório")

    const collabRef = adminDb.collection('agencies').doc(agencyId).collection('collaborators').doc(userId)

    const docData: any = {
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }

    // Se houver CPF, garante criptografia
    if (data.cpf) docData.cpfEncrypted = encrypt(data.cpf.replace(/\D/g, ''))

    await collabRef.set(docData, { merge: true })

    revalidatePath('/colaboradores')
    return { success: true }
  } catch (error: any) {
    console.error("Erro no upsert do colaborador:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Registra uma ausência para o colaborador.
 */
export async function registerAbsenceAction(collaboratorId: string, data: any) {
  const session = await getPortalSession()
  if (!session || !session.uid) return { success: false, error: 'Não autorizado' }
  const userId = session.uid

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
  const session = await getPortalSession()
  if (!session || !session.uid) return { success: false, error: 'Não autorizado' }
  const userId = session.uid

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

