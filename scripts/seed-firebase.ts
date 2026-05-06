import * as admin from 'firebase-admin'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

dotenv.config()

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')

if (!getApps().length) {
  initializeApp({
    credential: cert({
      ...serviceAccount,
      privateKey: serviceAccount.private_key?.replace(/\\n/g, '\n')
    })
  })
}

const db = getFirestore()
const AGENCY_ID = 'audazz-nexus'

async function seed() {
  console.log('🌱 Semeando dados de exemplo no Firebase...')

  const batch = db.batch()

  // 1. Cliente de Exemplo
  const clientRef = db.collection('agencies').doc(AGENCY_ID).collection('clients').doc('client-1')
  batch.set(clientRef, {
    name: 'Audazz Design Studio',
    tradeName: 'Audazz',
    status: 'ativo',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    deletedAt: null,
    searchTokens: ['audazz', 'design', 'studio']
  })

  // 2. Projeto de Exemplo
  const projectRef = db.collection('agencies').doc(AGENCY_ID).collection('projects').doc('project-1')
  batch.set(projectRef, {
    name: 'Migrao Firebase',
    clientId: 'client-1',
    clientName: 'Audazz',
    status: 'em_andamento',
    priority: 'alta',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    deletedAt: null
  })

  // 3. Colaborador de Exemplo
  const collabRef = db.collection('agencies').doc(AGENCY_ID).collection('collaborators').doc('collab-1')
  batch.set(collabRef, {
    name: 'Witalo Sousa',
    emailProfissional: 'contato@audazz.com',
    cargo: 'Diretor de Tecnologia',
    departamento: 'TI',
    ativo: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    deletedAt: null
  })

  // 4. Notificao de Exemplo
  const notifRef = db.collection('agencies').doc(AGENCY_ID).collection('notifications').doc()
  batch.set(notifRef, {
    userId: 'user_1',
    title: 'Bem-vindo ao Nexus OS',
    body: 'Sua migrao para Firebase foi concluda com sucesso.',
    type: 'success',
    read: false,
    createdAt: FieldValue.serverTimestamp()
  })

  await batch.commit()
  console.log('✅ Firebase semeado com sucesso!')
}

seed().catch(console.error)
