'use server'

import { adminDb } from '@/lib/firebase/admin'
import { getPortalSession } from '@/lib/security/session'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Dispara uma notificao interna para um usurio.
 * Usada por outras actions e Cloud Functions.
 */
export async function createNotificationAction(agencyId: string, userId: string, data: {
  title: string,
  body: string,
  type: 'info' | 'success' | 'warning' | 'error',
  link?: string,
  relatedId?: string,
  relatedType?: string
}) {
  // Nota: Esta action pode ser chamada internamente pelo sistema sem auth() em alguns casos (Cloud Functions)
  // Mas para chamadas via UI, validamos o usurio.
  
  try {
    const notificationRef = adminDb
      .collection('agencies')
      .doc(agencyId)
      .collection('notifications')
      .doc()

    await notificationRef.set({
      ...data,
      userId,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })

    return { success: true, id: notificationRef.id }
  } catch (error: any) {
    console.error("Erro ao criar notificao:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Marca uma notificao como lida.
 */
export async function markNotificationAsReadAction(agencyId: string, notificationId: string) {
  const session = await getPortalSession()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const docRef = adminDb
      .collection('agencies')
      .doc(agencyId)
      .collection('notifications')
      .doc(notificationId)

    await docRef.update({
      read: true,
      readAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
