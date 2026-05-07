'use server'

import { adminDb, adminAuth } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { encrypt } from '@/lib/security/crypto'
import { revalidatePath } from 'next/cache'
import { auth, currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'
import { mapCpfToEmail, generateSystemPassword } from '@/lib/security/passwords'

/**
 * Cria um novo colaborador com acesso ao Portal (Firebase Auth)
 * O ID de acesso  o CPF e a senha  gerada automaticamente.
 */
export async function createCollaboratorAction(data: any) {
  const { userId: adminId } = await auth()
  const adminUser = await currentUser()
  
  if (!adminId || !adminUser) {
    return { success: false, error: 'Não autorizado' }
  }

  try {
    const agencyId = "audazz-nexus" // Default agency for the system
    const generatedPassword = generateSystemPassword()
    const virtualEmail = mapCpfToEmail(data.cpf)

    // 1. Cria o usuário no Firebase Auth para o Portal
    const userRecord = await adminAuth.createUser({
      email: virtualEmail,
      password: generatedPassword,
      displayName: data.nome,
      phoneNumber: data.telefone ? `+55${data.telefone.replace(/\D/g, '')}` : undefined,
    })

    // 2. Define Custom Claims (Acesso Portal)
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      agencyId,
      role: data.role || 'criativo',
      isCollaborator: true,
      cpf: data.cpf.replace(/\D/g, '')
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
      cpf: data.cpf, // Mantemos o formatado para exibição
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

    // Criptografia de dados sensíveis para o Firestore
    if (data.cpf) docData.cpfEncrypted = encrypt(data.cpf.replace(/\D/g, ''))
    if (data.salarioMensal) docData.salarioMensalEncrypted = encrypt(data.salarioMensal.toString())
    if (data.chavePix) docData.chavePixEncrypted = encrypt(data.chavePix)

    // 4. Salva no Firestore
    const collabRef = adminDb
      .collection('agencies')
      .doc(agencyId)
      .collection('collaborators')
      .doc(userRecord.uid)

    await collabRef.set(docData)

    // 5. Log de Auditoria
    await logAudit({
      agencyId,
      userId: adminId,
      userEmail: adminUser.emailAddresses[0].emailAddress,
      userRole: 'admin',
      acao: 'CREATE_COLLABORATOR',
      recurso: 'COLLABORATOR',
      recursoId: userRecord.uid,
      sucesso: true
    })

    revalidatePath('/colaboradores')
    
    return { 
      success: true, 
      uid: userRecord.uid, 
      password: generatedPassword,
      accessId: data.cpf
    }

  } catch (error: any) {
    console.error("Erro ao admitir colaborador:", error)
    if (error.code === 'auth/email-already-exists') {
      return { success: false, error: 'Este CPF já possui um acesso cadastrado.' }
    }
    return { success: false, error: error.message }
  }
}

/**
 * Mantemos a função de upsert para compatibilidade ou atualizações simples via Clerk
 */
export async function upsertCollaboratorAction(data: any) {
  const { userId: adminId } = await auth()
  if (!adminId) return { success: false, error: 'Não autorizado' }

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
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Não autorizado' }

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
  if (!userId) return { success: false, error: 'Não autorizado' }

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

