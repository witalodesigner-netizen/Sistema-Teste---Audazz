"use client"

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

/**
 * Configurao das variveis de ambiente do Firebase (Lado do Cliente)
 * Certifique-se de que estas chaves foram adicionadas ao seu arquivo .env.local
 * com o prefixo NEXT_PUBLIC_
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Inicializa o Firebase apenas se ele ainda no tiver sido inicializado (Singleton pattern)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

/**
 * Exportao dos servios do Firebase para uso em componentes Cliente
 */
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app
