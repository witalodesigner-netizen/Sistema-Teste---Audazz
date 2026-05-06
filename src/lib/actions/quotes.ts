'use server'

import { adminDb } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { auth, currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Esquema de validao para oramentos.
 */
const QuoteSchema = z.object({
  agencyId: z.string().min(1),
  clientId: z.string().min(1),
  clientName: z.string(),
  title: z.string().min(3, "Ttulo obrigatrio"),
  description: z.string().optional(),
  total: z.number().positive("Valor total deve ser positivo"),
  validUntil: z.string().optional()
})

/**
 * Cria um novo oramento para o cliente.
 */
export async function createQuoteAction(data: z.infer<typeof QuoteSchema>) {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId || !user) return { success: false, error: 'No autorizado' }

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
      userId,
      userEmail: user.emailAddresses[0].emailAddress,
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
    console.error("Erro ao criar oramento:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Atualiza o status de um oramento.
 */
export async function updateQuoteStatusAction(agencyId: string, quoteId: string, status: string) {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId || !user) return { success: false, error: 'No autorizado' }

  try {
    const quoteRef = adminDb.collection('agencies').doc(agencyId).collection('quotes').doc(quoteId)
    
    await quoteRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp()
    })

    await logAudit({
      agencyId,
      userId,
      userEmail: user.emailAddresses[0].emailAddress,
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
