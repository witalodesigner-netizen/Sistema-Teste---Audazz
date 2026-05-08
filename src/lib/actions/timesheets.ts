'use server'

import { adminDb } from '@/lib/firebase/admin'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'
import { getPortalSession } from '@/lib/security/session'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

const TimesheetSchema = z.object({
  agencyId: z.string().min(1),
  collaboratorId: z.string().min(1),
  projectId: z.string().min(1),
  projectName: z.string(),
  taskId: z.string().optional(),
  taskName: z.string().optional(),
  hours: z.number().positive(),
  description: z.string().min(1),
  date: z.string()
})

/**
 * Registra horas trabalhadas no timesheet do colaborador.
 */
export async function logTimeAction(data: z.infer<typeof TimesheetSchema>) {
  const session = await getPortalSession()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const validated = TimesheetSchema.parse(data)
    
    // O timesheet  uma subcoleo de colaborador para melhor organizao
    const timesheetRef = adminDb
      .collection('agencies')
      .doc(validated.agencyId)
      .collection('collaborators')
      .doc(validated.collaboratorId)
      .collection('timesheets')
      .doc()

    const newEntry = {
      ...validated,
      date: new Date(validated.date),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null
    }

    await timesheetRef.set(newEntry)

    // Revalida dashboard e relatrios
    revalidatePath('/dashboard')
    revalidatePath('/colaboradores')
    
    return { success: true, id: timesheetRef.id }
  } catch (error: any) {
    console.error("Erro ao registrar horas:", error)
    return { success: false, error: error.message }
  }
}
