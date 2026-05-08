'use server'

import { adminDb } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { getPortalSession } from '@/lib/security/session'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

const QuoteSchema = z.object({
  agencyId: z.string().min(1),
  clientId: z.string().min(1),
  clientName: z.string(),
  title: z.string().min(3, "Título obrigatório"),
  description: z.string().optional(),
  total: z.number().positive("Valor total deve ser positivo"),
  validUntil: z.string().optional()
})

export async function createQuoteAction(data: z.infer<typeof QuoteSchema>) {
  const session = await getPortalSession()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const validated = QuoteSchema.parse(data)
    const quoteRef = adminDb.collection('agencies').doc(validated.agencyId).collection('quotes').doc()

    const newQuote = {
      ...validated,
      validUntil: validated.validUntil ? new Date(validated.validUntil) : null,
      status: 'rascunho',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null
    }

    await quoteRef.set(newQuote)

    await logAudit({
      agencyId: validated.agencyId,
      userId: session.uid,
      userEmail: session.email || 'sistema@audazz.com',
      userRole: 'admin',
      acao: 'CREATE',
      recurso: 'QUOTE',
      recursoId: quoteRef.id,
      dadosDepois: newQuote,
      sucesso: true
    })

    revalidatePath('/quotes')
    return { success: true, id: quoteRef.id }
  } catch (error: any) {
    console.error("Erro ao criar orçamento:", error)
    return { success: false, error: error.message }
  }
}

export async function updateQuoteStatusAction(agencyId: string, quoteId: string, status: string) {
  const session = await getPortalSession()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const quoteRef = adminDb.collection('agencies').doc(agencyId).collection('quotes').doc(quoteId)
    
    await quoteRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp()
    })

    await logAudit({
      agencyId,
      userId: session.uid,
      userEmail: session.email || 'sistema@audazz.com',
      userRole: 'admin',
      acao: 'UPDATE_QUOTE_STATUS',
      recurso: 'QUOTE',
      recursoId: quoteId,
      dadosDepois: { status },
      sucesso: true
    })

    revalidatePath('/quotes')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
