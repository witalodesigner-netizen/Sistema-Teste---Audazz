import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

/**
 * Criptografia AES-256-GCM para proteo de dados sensveis.
 * Requer a varivel de ambiente ENCRYPTION_KEY com 64 caracteres hex (32 bytes).
 */
export function encrypt(text: string): string {
  if (!process.env.ENCRYPTION_KEY || !text) return text
  
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  
  // Retorna IV + AuthTag + Encrypted em um nico buffer convertido para hex
  return Buffer.concat([iv, authTag, encrypted]).toString('hex')
}

export function decrypt(encryptedHex: string): string {
  if (!process.env.ENCRYPTION_KEY || !encryptedHex) return encryptedHex
  
  try {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    const data = Buffer.from(encryptedHex, 'hex')
    
    const iv = data.subarray(0, IV_LENGTH)
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
    const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH)
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)
    
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
  } catch (error) {
    console.error("Falha na descriptografia:", error)
    return "[ERRO_DE_CRIPTOGRAFIA]"
  }
}
