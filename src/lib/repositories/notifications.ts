import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/client'
import { createConverter } from '../firebase/converters'

const COLLECTION_NAME = 'notifications'
const notificationConverter = createConverter<any>()

export const NotificationRepository = {
  /**
   * Busca todas as notificações não lidas de um usuário.
   */
  async getUnread(agencyId: string, userId: string): Promise<any[]> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(notificationConverter)
    const q = query(
      ref, 
      where('userId', '==', userId), 
      where('read', '==', false), 
      orderBy('createdAt', 'desc'), 
      limit(50)
    )
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
  },

  /**
   * Marca uma notificação como lida.
   */
  async markAsRead(agencyId: string, notificationId: string): Promise<void> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, notificationId)
    await updateDoc(docRef, { 
      read: true, 
      readAt: serverTimestamp() 
    })
  }
}
