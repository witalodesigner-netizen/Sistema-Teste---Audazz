import { 
  collectionGroup, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/client'
import { createConverter } from '../firebase/converters'
import { WithId } from '../types/firebase'
import { PaginationOptions, PaginatedResult } from './base'

const COLLECTION_NAME = 'timesheets'
const timesheetConverter = createConverter<any>()

export const TimesheetRepository = {
  /**
   * Busca registros de horas usando Collection Group.
   * IMPORTANTE: Requer ndice composto de Collection Group para [agencyId, date].
   */
  async getAll(
    agencyId: string, 
    options: PaginationOptions & { collaboratorId?: string } = {}
  ): Promise<PaginatedResult<WithId<any>>> {
    const ref = collectionGroup(db, COLLECTION_NAME).withConverter(timesheetConverter)
    
    const constraints: any[] = [
      where('agencyId', '==', agencyId),
      orderBy('date', 'desc'),
      limit(options.limit || 50)
    ]

    if (options.collaboratorId) constraints.unshift(where('collaboratorId', '==', options.collaboratorId))
    if (options.cursor) constraints.push(startAfter(options.cursor))

    const q = query(ref, ...constraints)
    const snapshot = await getDocs(q)
    
    return {
      data: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === (options.limit || 50)
    }
  }
}
