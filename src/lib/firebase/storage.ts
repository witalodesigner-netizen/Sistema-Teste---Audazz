import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  SettableMetadata
} from 'firebase/storage'
import { storage } from './client'

/**
 * Realiza o upload de um arquivo (File ou Blob) para o Firebase Storage.
 * 
 * @param path Caminho completo no bucket (ex: agencies/{id}/projects/{id}/file.pdf)
 * @param file O arquivo vindo do input ou processamento
 * @param metadata Metadados opcionais (contentType, customMetadata, etc)
 */
export async function uploadFile(
  path: string, 
  file: File | Blob, 
  metadata?: SettableMetadata
) {
  try {
    const storageRef = ref(storage, path)
    const uploadResult = await uploadBytes(storageRef, file, metadata)
    const url = await getDownloadURL(uploadResult.ref)
    
    return {
      url,
      storagePath: path,
      metadata: uploadResult.metadata
    }
  } catch (error: any) {
    console.error("Erro no upload do arquivo:", error)
    throw new Error(`Falha no upload: ${error.message}`)
  }
}

/**
 * Remove um arquivo do storage baseado no seu caminho.
 * 
 * @param storagePath O caminho absoluto dentro do bucket
 */
export async function deleteFile(storagePath: string) {
  try {
    const storageRef = ref(storage, storagePath)
    await deleteObject(storageRef)
  } catch (error: any) {
    // Se o arquivo j no existir, ignoramos o erro
    if (error.code === 'storage/object-not-found') return
    throw error
  }
}

/**
 * Recupera a URL de download atualizada de um arquivo.
 * til para arquivos que podem ter tido a URL expirada ou alterada.
 */
export async function getDownloadUrl(storagePath: string) {
  try {
    const storageRef = ref(storage, storagePath)
    return await getDownloadURL(storageRef)
  } catch (error) {
    return null
  }
}

/**
 * Helper para prever o caminho da thumbnail gerada pela Cloud Function.
 * Geralmente as funes de redimensionamento seguem um padro de sufixo.
 * 
 * @param storagePath Caminho do arquivo original
 * @param size Tamanho da thumbnail (ex: 400x400)
 */
export function getThumbnailPath(storagePath: string, size: string = '400x400') {
  const extension = storagePath.split('.').pop()
  const pathWithoutExtension = storagePath.substring(0, storagePath.lastIndexOf('.'))
  
  // Padro comum: path/to/image_400x400.png
  return `${pathWithoutExtension}_${size}.${extension}`
}
