import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter 
} from 'firebase/firestore'
import { db } from '../firebase/client'
import { createConverter } from '../firebase/converters'
import { PaginationOptions, PaginatedResult } from './base'

const COLLECTION_NAME = 'auditLogs'
const auditLogConverter = createConverter<any>()

export const AuditLogRepository = {
  /**
   * Lista logs de auditoria de forma paginada.
   */
  async getAll(
    agencyId: string, 
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<any>> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(auditLogConverter)
    
    const constraints: any[] = [
      orderBy('createdAt', 'desc'), 
      limit(options.limit || 100)
    ]
    
    if (options.cursor) constraints.push(startAfter(options.cursor))
    
    const q = query(ref, ...constraints)
    const snapshot = await getDocs(q)
    
    return {
      data: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === (options.limit || 100)
    }
  }
}
