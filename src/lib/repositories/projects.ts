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
import { Project, ProjectStatus, CreateData, UpdateData, WithId } from '../types/firebase'
import { PaginationOptions, PaginatedResult, generateSearchTokens } from './base'

const COLLECTION_NAME = 'projects'
const projectConverter = createConverter<Project>()

export const ProjectRepository = {
  /**
   * Busca todos os projetos de uma agncia com filtros e paginao.
   */
  async getAll(
    agencyId: string, 
    options: PaginationOptions & { status?: ProjectStatus; clientId?: string } = {}
  ): Promise<PaginatedResult<WithId<Project>>> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(projectConverter)
    
    const constraints: any[] = [
      where('deletedAt', '==', null),
      orderBy(options.orderByField || 'createdAt', options.orderDirection || 'desc'),
      limit(options.limit || 10)
    ]

    if (options.status) constraints.unshift(where('status', '==', options.status))
    if (options.clientId) constraints.unshift(where('clientId', '==', options.clientId))
    if (options.cursor) constraints.push(startAfter(options.cursor))

    const q = query(ref, ...constraints)
    const snapshot = await getDocs(q)
    
    return {
      data: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as WithId<Project>),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === (options.limit || 10)
    }
  },

  /**
   * Busca um projeto especfico por ID.
   */
  async getById(agencyId: string, projectId: string): Promise<WithId<Project> | null> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, projectId).withConverter(projectConverter)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    return { ...snapshot.data(), id: snapshot.id } as WithId<Project>
  },

  /**
   * Cria um novo projeto.
   */
  async create(agencyId: string, data: CreateData<Project>): Promise<string> {
    const ref = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(projectConverter)
    
    const docData = {
      ...data,
      searchTokens: generateSearchTokens(data.name),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null
    } as any

    const docRef = await addDoc(ref, docData)
    return docRef.id
  },

  /**
   * Atualiza um projeto.
   */
  async update(agencyId: string, projectId: string, data: UpdateData<Project>): Promise<void> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, projectId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  }
}
