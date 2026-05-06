'use server'

import { adminDb } from '@/lib/firebase/admin'
import { encrypt } from '@/lib/security/crypto'
import { logAudit } from '@/lib/security/audit'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Salva as configuraes da API do Asaas com criptografia da chave.
 */
export async function saveAsaasConfigAction(agencyId: string, data: { 
  apiKey: string, 
  environment: 'sandbox' | 'production' 
}) {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId || !user) return { success: false, error: 'No autorizado' }

  try {
    const configRef = adminDb
      .collection('agencies')
      .doc(agencyId)
      .collection('config')
      .doc('asaas')

    await configRef.set({
      apiKeyEncrypted: encrypt(data.apiKey),
      environment: data.environment,
      ativo: true,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true })

    await logAudit({
      agencyId,
      userId,
      userEmail: user.emailAddresses[0].emailAddress,
      userRole: 'admin',
      acao: 'UPDATE_CONFIG',
      recurso: 'ASAAS',
      sucesso: true
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao configurar Asaas:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Salva configuraes da Evolution API (WhatsApp).
 */
export async function saveWhatsAppConfigAction(agencyId: string, data: any) {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId || !user) return { success: false, error: 'No autorizado' }

  try {
    const configRef = adminDb.collection('agencies').doc(agencyId).collection('config').doc('whatsapp')

    await configRef.set({
      ...data,
      evolutionApiKeyEncrypted: data.apiKey ? encrypt(data.apiKey) : undefined,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true })

    revalidatePath('/settings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
