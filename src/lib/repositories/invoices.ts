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
import { Invoice, CreateData, UpdateData, WithId } from '../types/firebase'
import { PaginationOptions, PaginatedResult } from './base'

const COLLECTION_NAME = 'invoices'
const invoiceConverter = createConverter<Invoice>()

export const InvoiceRepository = {
  /**
   * Busca todas as faturas com suporte a filtros de status e cliente.
   */
  async getAll(
    agencyId: string, 
    options: PaginationOptions & { status?: string; clientId?: string } = {}
  ): Promise<PaginatedResult<WithId<Invoice>>> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(invoiceConverter)
    
    const constraints: any[] = [
      where('deletedAt', '==', null),
      orderBy(options.orderByField || 'dueDate', options.orderDirection || 'asc'),
      limit(options.limit || 10)
    ]

    if (options.status) constraints.unshift(where('status', '==', options.status))
    if (options.clientId) constraints.unshift(where('clientId', '==', options.clientId))
    if (options.cursor) constraints.push(startAfter(options.cursor))

    const q = query(ref, ...constraints)
    const snapshot = await getDocs(q)
    
    return {
      data: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as WithId<Invoice>),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === (options.limit || 10)
    }
  },

  /**
   * Busca uma fatura por ID.
   */
  async getById(agencyId: string, invoiceId: string): Promise<WithId<Invoice> | null> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, invoiceId).withConverter(invoiceConverter)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    return { ...snapshot.data(), id: snapshot.id } as WithId<Invoice>
  }
}
