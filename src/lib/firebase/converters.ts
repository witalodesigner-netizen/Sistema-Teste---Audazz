import { 
  FirestoreDataConverter, 
  QueryDocumentSnapshot, 
  SnapshotOptions,
  DocumentData,
  Timestamp
} from 'firebase/firestore'

/**
 * Remove recursivamente todos os campos 'undefined' de um objeto.
 * O Firestore no aceita 'undefined', apenas 'null' ou a ausncia do campo.
 */
export const cleanUndefined = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj
  
  // Se for um array, limpa cada item
  if (Array.isArray(obj)) {
    return obj.map(item => cleanUndefined(item))
  }

  const newObj: any = {}
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (value !== undefined) {
      newObj[key] = typeof value === 'object' ? cleanUndefined(value) : value
    }
  })
  return newObj
}

/**
 * Converte recursivamente Timestamps do Firestore para objetos Date do JavaScript.
 */
export const convertTimestamps = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj

  // Se for um Timestamp do Firestore, converte para Date
  if (obj instanceof Timestamp) {
    return obj.toDate()
  }

  // Se for um array, converte cada item
  if (Array.isArray(obj)) {
    return obj.map(item => convertTimestamps(item))
  }

  const newObj: any = {}
  Object.keys(obj).forEach(key => {
    newObj[key] = convertTimestamps(obj[key])
  })
  return newObj
}

/**
 * Fbrica de Converters Tipados.
 * Cria um FirestoreDataConverter para uma interface especfica.
 */
export const createConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore(data: T): DocumentData {
    // Antes de salvar: Limpa undefined e prepara para o Firestore
    return cleanUndefined(data)
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
    const data = snapshot.data(options)
    // Ao ler: Converte Timestamps para Dates nativas do JS
    return convertTimestamps(data) as T
  }
})
