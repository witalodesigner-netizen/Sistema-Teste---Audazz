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
import { Client, ClientStatus, CreateData, UpdateData, WithId } from '../types/firebase'
import { PaginationOptions, PaginatedResult, generateSearchTokens } from './base'

const COLLECTION_NAME = 'clients'
const clientConverter = createConverter<Client>()

export const ClientRepository = {
  /**
   * Busca todos os clientes de uma agncia com filtros e paginao.
   */
  async getAll(
    agencyId: string, 
    options: PaginationOptions & { status?: ClientStatus } = {}
  ): Promise<PaginatedResult<WithId<Client>>> {
    const clientsRef = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(clientConverter)
    
    const constraints: any[] = [
      where('deletedAt', '==', null),
      orderBy(options.orderByField || 'createdAt', options.orderDirection || 'desc'),
      limit(options.limit || 10)
    ]

    if (options.status) {
      constraints.unshift(where('status', '==', options.status))
    }

    if (options.cursor) {
      constraints.push(startAfter(options.cursor))
    }

    const q = query(clientsRef, ...constraints)
    const snapshot = await getDocs(q)
    
    const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as WithId<Client>)
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null

    return {
      data,
      lastDoc,
      hasMore: snapshot.docs.length === (options.limit || 10)
    }
  },

  /**
   * Busca um cliente especfico por ID.
   */
  async getById(agencyId: string, clientId: string): Promise<WithId<Client> | null> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, clientId).withConverter(clientConverter)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) return null
    return { ...snapshot.data(), id: snapshot.id } as WithId<Client>
  },

  /**
   * Cria um novo cliente com tokens de busca automticos.
   */
  async create(agencyId: string, data: CreateData<Client>): Promise<string> {
    const clientsRef = collection(db, 'agencies', agencyId, COLLECTION_NAME).withConverter(clientConverter)
    
    const docData = {
      ...data,
      searchTokens: generateSearchTokens(data.name + ' ' + (data.tradeName || '')),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null
    } as any

    const docRef = await addDoc(clientsRef, docData)
    return docRef.id
  },

  /**
   * Atualiza os dados de um cliente.
   */
  async update(agencyId: string, clientId: string, data: UpdateData<Client>): Promise<void> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, clientId)
    
    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp()
    }

    if (data.name) {
      updateData.searchTokens = generateSearchTokens(data.name + ' ' + (data.tradeName || ''))
    }

    await updateDoc(docRef, updateData)
  },

  /**
   * Realiza o Soft Delete de um cliente.
   */
  async softDelete(agencyId: string, clientId: string): Promise<void> {
    const docRef = doc(db, 'agencies', agencyId, COLLECTION_NAME, clientId)
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }
}
