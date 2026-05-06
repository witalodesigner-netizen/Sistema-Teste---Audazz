import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/client'
import { createConverter } from '../firebase/converters'
import { CreateData, UpdateData, WithId } from '../types/firebase'
import { PaginationOptions, PaginatedResult } from './base'

export interface Quote {
  agencyId: string
  clientId: string
  clientName: string
  title: string
  description?: string
  total: number
  status: 'rascunho' | 'enviado' | 'aprovado' | 'recusado' | 'expirado'
  createdAt: any
  updatedAt: any
  deletedAt: any
}

const COLLECTION_NAME = 'quotes'
const quoteConverter = createConverter<Quote>()

export const QuoteRepository = {
  /**
   * Busca todos os oramentos de uma agncia.
   */
  async getAll(
    agencyId: string, 
    options: PaginationOptions & { clientId?: string } = {}
  ): Promise<PaginatedResult<WithId<Quote>>> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(quoteConverter)
    
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
      data: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as WithId<Quote>),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === (options.limit || 10)
    }
  },

  /**
   * Busca um oramento por ID.
   */
  async getById(agencyId: string, quoteId: string): Promise<WithId<Quote> | null> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, quoteId).withConverter(quoteConverter)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    return { ...snapshot.data(), id: snapshot.id } as WithId<Quote>
  }
}
