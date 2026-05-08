'use server'

import { adminDb } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { getPortalSession } from '@/lib/security/session'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Esquema de validao para criao/atualizao de cliente.
 */
const ClientSchema = z.object({
  agencyId: z.string().min(1, "ID da agncia obrigatrio"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  tradeName: z.string().optional(),
  cnpj: z.string().optional(),
  status: z.string().default('ativo'),
  email: z.string().email().optional(),
  phone: z.string().optional()
})

/**
 * Server Action para criar um novo cliente no Firestore via Admin SDK.
 */
export async function createClientAction(data: z.infer<typeof ClientSchema>) {
  const session = await getPortalSession()
  
  if (!session || !session.uid) {
    return { success: false, error: 'Sessão expirada ou não autorizada' }
  }
  const userId = session.uid
  const userEmail = session.email || 'admin@audazz.com'

  try {
    const validatedData = ClientSchema.parse(data)
    
    const clientRef = adminDb
      .collection('agencies')
      .doc(validatedData.agencyId)
      .collection('clients')
      .doc()

    const newClient = {
      ...validatedData,
      responsibleUserId: userId,
      responsibleUserName: userEmail,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null,
      tags: []
    }

    // Executa a escrita no Firestore
    await clientRef.set(newClient)

    // Registra a auditoria
    await logAudit({
      agencyId: validatedData.agencyId,
      userId,
      userEmail: userEmail,
      userRole: 'admin', // Idealmente buscado de uma coleo de 'profiles'
      acao: 'CREATE',
      recurso: 'CLIENT',
      recursoId: clientRef.id,
      dadosDepois: newClient,
      sucesso: true
    })

    revalidatePath('/clients')
    return { success: true, id: clientRef.id }
    
  } catch (error: any) {
    console.error("Erro na Action createClient:", error)
    return { success: false, error: error.message || "Erro interno do servidor" }
  }
}

/**
 * Server Action para excluso lgica (Soft Delete) de cliente.
 */
export async function deleteClientAction(agencyId: string, clientId: string) {
  const session = await getPortalSession()

  if (!session || !session.uid) return { success: false, error: 'Não autorizado' }
  const userId = session.uid
  const userEmail = session.email || 'admin@audazz.com'

  try {
    const clientRef = adminDb
      .collection('agencies')
      .doc(agencyId)
      .collection('clients')
      .doc(clientId)

    await clientRef.update({
      deletedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })

    await logAudit({
      agencyId,
      userId,
      userEmail: userEmail,
      userRole: 'admin',
      acao: 'DELETE_SOFT',
      recurso: 'CLIENT',
      recursoId: clientId,
      sucesso: true
    })

    revalidatePath('/clients')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
