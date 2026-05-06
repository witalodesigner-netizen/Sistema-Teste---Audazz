import crypto from 'crypto';

/**
 * Módulo de Segurança - Audazz Nexus OS
 * Criptografia AES-256-GCM (Ponta a Ponta)
 * 
 * Este módulo lida com a proteção de dados sensíveis no banco de dados.
 */

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 64 caracteres hex
const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT || 'audazz-nexus-salt';
const HASH_SALT = process.env.HASH_SALT || 'audazz-nexus-hash-salt';
const ITERATIONS = 100000;
const KEY_LEN = 32; // 256 bits
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  console.warn('⚠️ ENCRYPTION_KEY não configurada corretamente. Use uma chave de 64 caracteres hex.');
}

/**
 * Deriva uma chave criptográfica a partir da chave mestra e salt
 */
function getDerivedKey(): Buffer {
  if (!ENCRYPTION_KEY) throw new Error('Chave de criptografia não definida no ambiente.');
  return crypto.pbkdf2Sync(ENCRYPTION_KEY, ENCRYPTION_SALT, ITERATIONS, KEY_LEN, 'sha256');
}

/**
 * Criptografa um texto usando AES-256-GCM
 */
export function encrypt(plaintext: string): { ciphertext: string; iv: string; tag: string } {
  try {
    const iv = crypto.randomBytes(12);
    const key = getDerivedKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
    ciphertext += cipher.final('base64');
    
    const tag = cipher.getAuthTag().toString('base64');
    
    return {
      ciphertext,
      iv: iv.toString('base64'),
      tag
    };
  } catch (error) {
    console.error('Erro na criptografia:', error);
    throw new Error('Falha ao proteger dados sensíveis.');
  }
}

/**
 * Descriptografa um texto usando AES-256-GCM e verifica a tag de autenticação
 */
export function decrypt(ciphertext: string, iv: string, tag: string): string {
  try {
    const key = getDerivedKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'base64'));
    
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    
    let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
    plaintext += decipher.final('utf8');
    
    return plaintext;
  } catch (error) {
    console.error('Erro na descriptografia (Tag inválida ou dados corrompidos):', error);
    throw new Error('Falha ao acessar dados protegidos. A integridade dos dados pode ter sido violada.');
  }
}

/**
 * Gera um hash SHA-256 para busca em campos criptografados (determinístico)
 */
export function hashSensitive(value: string): string {
  return crypto
    .createHmac('sha256', HASH_SALT)
    .update(value)
    .digest('hex');
}

/**
 * Criptografa um objeto JSON completo
 */
export function encryptJSON(obj: Record<string, any>): string {
  const jsonString = JSON.stringify(obj);
  const { ciphertext, iv, tag } = encrypt(jsonString);
  // Retorna um bundle compactado em base64 do JSON {c, i, t}
  return Buffer.from(JSON.stringify({ c: ciphertext, i: iv, t: tag })).toString('base64');
}

/**
 * Descriptografa um objeto JSON completo
 */
export function decryptJSON(encryptedBundle: string): Record<string, any> {
  try {
    const decoded = JSON.parse(Buffer.from(encryptedBundle, 'base64').toString('utf8'));
    const plaintext = decrypt(decoded.c, decoded.i, decoded.t);
    return JSON.parse(plaintext);
  } catch (error) {
    throw new Error('Falha ao descriptografar objeto JSON.');
  }
}
