'use server'

import { adminDb } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { auth, currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Esquema de validao para faturas.
 */
const InvoiceSchema = z.object({
  agencyId: z.string().min(1),
  clientId: z.string().min(1),
  clientName: z.string(),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  description: z.string().min(1, "Descrio obrigatria"),
  value: z.number().positive("Valor deve ser positivo"),
  dueDate: z.string().min(1, "Data de vencimento obrigatria"),
  paymentMethod: z.string().optional()
})

/**
 * Cria uma nova fatura financeira.
 */
export async function createInvoiceAction(data: z.infer<typeof InvoiceSchema>) {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId || !user) return { success: false, error: 'No autorizado' }

  try {
    const validated = InvoiceSchema.parse(data)
    const invoiceRef = adminDb.collection('agencies').doc(validated.agencyId).collection('invoices').doc()

    const newInvoice = {
      ...validated,
      dueDate: new Date(validated.dueDate),
      status: 'pendente',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null
    }

    await invoiceRef.set(newInvoice)

    await logAudit({
      agencyId: validated.agencyId,
      userId,
      userEmail: user.emailAddresses[0].emailAddress,
      userRole: 'admin',
      acao: 'CREATE',
      recurso: 'INVOICE',
      recursoId: invoiceRef.id,
      dadosDepois: newInvoice,
      sucesso: true
    })

    revalidatePath('/financeiro')
    return { success: true, id: invoiceRef.id }
  } catch (error: any) {
    console.error("Erro ao criar fatura:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Atualiza o status de pagamento de uma fatura.
 */
export async function updateInvoiceStatusAction(agencyId: string, invoiceId: string, status: string) {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId || !user) return { success: false, error: 'No autorizado' }

  try {
    const invoiceRef = adminDb.collection('agencies').doc(agencyId).collection('invoices').doc(invoiceId)
    
    const updateData: any = {
      status,
      updatedAt: FieldValue.serverTimestamp()
    }

    if (status === 'pago') {
      updateData.paidAt = FieldValue.serverTimestamp()
    }

    await invoiceRef.update(updateData)

    await logAudit({
      agencyId,
      userId,
      userEmail: user.emailAddresses[0].emailAddress,
      userRole: 'admin',
      acao: 'UPDATE_INVOICE_STATUS',
      recurso: 'INVOICE',
      recursoId: invoiceId,
      dadosDepois: { status },
      sucesso: true
    })

    revalidatePath('/financeiro')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
