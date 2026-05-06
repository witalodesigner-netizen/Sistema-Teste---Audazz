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
import { Approval, ApprovalStatus, CreateData, UpdateData, WithId } from '../types/firebase'
import { PaginationOptions, PaginatedResult } from './base'

const COLLECTION_NAME = 'approvals'
const approvalConverter = createConverter<Approval>()

export const ApprovalRepository = {
  /**
   * Busca todas as aprovaes de uma agncia.
   */
  async getAll(
    agencyId: string, 
    options: PaginationOptions & { status?: ApprovalStatus; projectId?: string; clientId?: string } = {}
  ): Promise<PaginatedResult<WithId<Approval>>> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(approvalConverter)
    
    const constraints: any[] = [
      where('deletedAt', '==', null),
      orderBy(options.orderByField || 'createdAt', options.orderDirection || 'desc'),
      limit(options.limit || 10)
    ]

    if (options.status) constraints.unshift(where('status', '==', options.status))
    if (options.projectId) constraints.unshift(where('projectId', '==', options.projectId))
    if (options.clientId) constraints.unshift(where('clientId', '==', options.clientId))
    if (options.cursor) constraints.push(startAfter(options.cursor))

    const q = query(ref, ...constraints)
    const snapshot = await getDocs(q)
    
    return {
      data: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as WithId<Approval>),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === (options.limit || 10)
    }
  },

  /**
   * Busca uma aprovao por ID.
   */
  async getById(agencyId: string, approvalId: string): Promise<WithId<Approval> | null> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, approvalId).withConverter(approvalConverter)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    return { ...snapshot.data(), id: snapshot.id } as WithId<Approval>
  }
}
