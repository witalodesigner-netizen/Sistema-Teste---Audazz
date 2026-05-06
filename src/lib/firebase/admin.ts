import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

/**
 * Configurao do Firebase Admin SDK (Lado do Servidor)
 * Utiliza a Service Account para acesso administrativo total.
 */
const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Corrige a formatao da chave privada que muitas vezes vem com \n escapado no .env
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
}

// Inicializa o Admin SDK apenas se no houver instncias ativas
const adminApp = getApps().length ? getApp() : initializeApp(adminConfig)

/**
 * Exportao dos servios administrativos
 * SEMPRE utilize estes em Server Actions e API Routes
 */
export const adminDb = getFirestore(adminApp)
export const adminAuth = getAuth(adminApp)
export const adminStorage = getStorage(adminApp)

export default adminApp
