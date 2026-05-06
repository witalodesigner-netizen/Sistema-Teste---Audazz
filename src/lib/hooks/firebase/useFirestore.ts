import { useState, useEffect } from 'react'
import { 
  Query, 
  DocumentReference, 
  onSnapshot, 
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore'

/**
 * Hook para escutar uma Coleo ou Query em tempo real.
 * 
 * @param query A consulta do Firestore (Query)
 */
export function useCollection<T extends DocumentData>(
  query: Query<T>
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // onSnapshot retorna uma funo de cancelamento (unsubscribe)
    const unsubscribe = onSnapshot(query, (snapshot: QuerySnapshot<T>) => {
      const items = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as T))
      
      setData(items)
      setLoading(false)
    }, (err) => {
      console.error("Erro no hook useCollection:", err)
      setError(err as Error)
      setLoading(false)
    })

    // Cleanup: Remove o listener quando o componente  desmontado
    return () => unsubscribe()
  }, [query])

  return { data, loading, error }
}

/**
 * Hook para escutar um Documento nico em tempo real.
 * 
 * @param docRef Referncia do documento
 */
export function useDocument<T extends DocumentData>(
  docRef: DocumentReference<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snapshot: DocumentSnapshot<T>) => {
      if (snapshot.exists()) {
        setData({ ...snapshot.data(), id: snapshot.id } as T)
      } else {
        setData(null)
      }
      setLoading(false)
    }, (err) => {
      console.error("Erro no hook useDocument:", err)
      setError(err as Error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [docRef])

  return { data, loading, error }
}
