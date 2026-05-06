import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs 
} from 'firebase/firestore'
import { db } from '../firebase/client'
import { createConverter } from '../firebase/converters'

export const IntegrationLogRepository = {
  /**
   * Busca logs de disparos de WhatsApp.
   */
  async getWhatsAppLogs(agencyId: string, limitCount = 50): Promise<any[]> {
    const ref = collection(db, 'agencies', agencyId, 'whatsappLogs').withConverter(createConverter<any>())
    const q = query(ref, orderBy('enviadaEm', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
  },

  /**
   * Busca logs de webhooks recebidos (Asaas, RD Station, etc).
   */
  async getWebhookLogs(agencyId: string, limitCount = 50): Promise<any[]> {
    const ref = collection(db, 'agencies', agencyId, 'webhookLogs').withConverter(createConverter<any>())
    const q = query(ref, orderBy('createdAt', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
  }
}
