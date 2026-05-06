import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter 
} from 'firebase/firestore'
import { db } from '../firebase/client'
import { createConverter } from '../firebase/converters'
import { WithId } from '../types/firebase'
import { PaginationOptions, PaginatedResult } from './base'

export interface Recurrence {
  agencyId: string
  clientId: string
  clientName: string
  service: string
  value: number
  billingDay: number
  status: 'ativa' | 'pausada' | 'cancelada'
  createdAt: any
  updatedAt: any
  deletedAt: any
}

const COLLECTION_NAME = 'recurrences'
const recurrenceConverter = createConverter<Recurrence>()

export const RecurrenceRepository = {
  /**
   * Busca todas as recorrncias (assinaturas) ativas.
   */
  async getAll(
    agencyId: string, 
    options: PaginationOptions & { clientId?: string } = {}
  ): Promise<PaginatedResult<WithId<Recurrence>>> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(recurrenceConverter)
    
    const constraints: any[] = [
      where('deletedAt', '==', null),
      orderBy(options.orderByField || 'createdAt', options.orderDirection || 'desc'),
      limit(options.limit || 10)
    ]

    if (options.clientId) constraints.unshift(where('clientId', '==', options.clientId))
    if (options.cursor) constraints.push(startAfter(options.cursor))

    const q = query(ref, ...constraints)
    const snapshot = await getDocs(q)
    
    return {
      data: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as WithId<Recurrence>),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === (options.limit || 10)
    }
  }
}
