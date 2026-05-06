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
import { Collaborator, WithId, CreateData, UpdateData } from '../types/firebase'
import { PaginationOptions, PaginatedResult, generateSearchTokens } from './base'

const COLLECTION_NAME = 'collaborators'
const collaboratorConverter = createConverter<Collaborator>()

export const CollaboratorRepository = {
  /**
   * Busca todos os colaboradores da agncia.
   */
  async getAll(
    agencyId: string, 
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<WithId<Collaborator>>> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(collaboratorConverter)
    
    const constraints: any[] = [
      where('deletedAt', '==', null),
      orderBy(options.orderByField || 'name', options.orderDirection || 'asc'),
      limit(options.limit || 20)
    ]

    if (options.cursor) constraints.push(startAfter(options.cursor))

    const q = query(ref, ...constraints)
    const snapshot = await getDocs(q)
    
    return {
      data: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as WithId<Collaborator>),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === (options.limit || 20)
    }
  },

  /**
   * Busca um colaborador pelo ID do usurio (Clerk ID).
   */
  async getByUserId(agencyId: string, userId: string): Promise<WithId<Collaborator> | null> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(collaboratorConverter)
    const q = query(ref, where('userId', '==', userId), limit(1))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    const doc = snapshot.docs[0]
    return { ...doc.data(), id: doc.id } as WithId<Collaborator>
  },

  /**
   * Busca um colaborador por ID direto.
   */
  async getById(agencyId: string, collaboratorId: string): Promise<WithId<Collaborator> | null> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, collaboratorId).withConverter(collaboratorConverter)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    return { ...snapshot.data(), id: snapshot.id } as WithId<Collaborator>
  }
}
