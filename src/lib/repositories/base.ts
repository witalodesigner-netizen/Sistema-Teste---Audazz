import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs,
  DocumentSnapshot
} from 'firebase/firestore'
import { db } from '../firebase/client'

export interface PaginationOptions {
  limit?: number
  cursor?: DocumentSnapshot
  orderByField?: string
  orderDirection?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  lastDoc: DocumentSnapshot | null
  hasMore: boolean
}

/**
 * Helper para gerar tokens de busca (trigramas) para pesquisa textual simples no Firestore.
 */
export function generateSearchTokens(text: string): string[] {
  if (!text) return []
  const tokens = new Set<string>()
  const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
  
  // Gera tokens por palavras e trigramas
  const words = cleanText.split(/\s+/)
  words.forEach(word => {
    // Trigramas
    for (let i = 0; i <= word.length - 3; i++) {
      tokens.add(word.substring(i, i + 3))
    }
    // Prefixos (para busca as you type)
    for (let i = 1; i <= word.length; i++) {
      tokens.add(word.substring(0, i))
    }
    tokens.add(word) // Adiciona a palavra inteira tambm
  })
  
  return Array.from(tokens)
}

/**
 * Classe base para todos os repositrios do sistema.
 */
export abstract class BaseRepository {
  protected async getPaginated<T>(
    collectionPath: any,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    const { 
      limit: limitAmount = 20, 
      cursor, 
      orderByField = 'createdAt', 
      orderDirection = 'desc' 
    } = options

    let q = query(
      collectionPath,
      orderBy(orderByField, orderDirection),
      limit(limitAmount + 1)
    )

    if (cursor) {
      q = query(q, startAfter(cursor))
    }

    const snapshot = await getDocs(q)
    const docs = snapshot.docs
    const hasMore = docs.length > limitAmount
    const data = hasMore ? docs.slice(0, limitAmount) : docs

    return {
      data: data.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as T[],
      lastDoc: data.length > 0 ? data[data.length - 1] as any : null,
      hasMore
    }
  }
}
