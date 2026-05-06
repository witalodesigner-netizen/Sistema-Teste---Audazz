import { 
  collection, 
  doc, 
  getDoc, 
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

const COLLECTION_NAME = 'members'
const memberConverter = createConverter<any>()

export const ClientMemberRepository = {
  /**
   * Lista todos os membros do portal de um cliente especfico.
   */
  async getByClientId(agencyId: string, clientId: string): Promise<WithId<any>[]> {
    const ref = collection(db, 'agencies', agencyId, 'clients', clientId, COLLECTION_NAME).withConverter(memberConverter)
    const q = query(ref, where('deletedAt', '==', null), orderBy('name', 'asc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
  },

  /**
   * Busca um membro especfico do portal.
   */
  async getById(agencyId: string, clientId: string, memberId: string): Promise<WithId<any> | null> {
    const docRef = doc(db, 'agencies', agencyId, 'clients', clientId, COLLECTION_NAME, memberId).withConverter(memberConverter)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    return { ...snapshot.data(), id: snapshot.id }
  }
}
