import { PrismaClient } from '@prisma/client'
import * as admin from 'firebase-admin'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

dotenv.config()

/**
 * Script de migrao automatizada do Prisma (PostgreSQL) para o Firebase (Firestore).
 * Este script mapeia as tabelas relacionais para colees multi-tenant no Firestore.
 */

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')

if (!getApps().length) {
  const account = {
    ...serviceAccount,
    privateKey: serviceAccount.private_key?.replace(/\\n/g, '\n')
  }
  initializeApp({
    credential: cert(account)
  })
}

const db = getFirestore()
const prisma = new PrismaClient()

// ID da Agncia Padrão para esta migrao
const AGENCY_ID = 'audazz-nexus'

async function migrateTable(name: string, data: any[], collectionPath: string) {
  console.log(`  - Migrando ${data.length} registros de ${name}...`)
  
  // Usamos batches para otimizar a escrita (limite de 500 por batch)
  let batch = db.batch()
  let count = 0

  for (const item of data) {
    const ref = db.doc(collectionPath.replace('{id}', item.id))
    
    // Converte datas do Prisma para Timestamps do Firestore
    const firestoreData = JSON.parse(JSON.stringify(item))
    
    // Remove relaes que sero subcolees ou referncias
    delete firestoreData.id
    
    batch.set(ref, {
      ...firestoreData,
      agencyId: AGENCY_ID,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true })

    count++
    if (count === 400) {
      await batch.commit()
      batch = db.batch()
      count = 0
    }
  }
  
  if (count > 0) await batch.commit()
}

async function startMigration() {
  console.log('\n--- 🚀 INICIANDO MIGRAO ESTRUTURAL PARA FIREBASE ---\n')

  try {
    // 1. Clientes
    const clients = await prisma.client.findMany()
    await migrateTable('Clientes', clients, `agencies/${AGENCY_ID}/clients/{id}`)

    // 2. Projetos
    const projects = await prisma.project.findMany()
    await migrateTable('Projetos', projects, `agencies/${AGENCY_ID}/projects/{id}`)

    // 3. Colaboradores
    const collaborators = await prisma.collaborator.findMany()
    await migrateTable('Colaboradores', collaborators, `agencies/${AGENCY_ID}/collaborators/{id}`)

    // 4. Faturas
    const invoices = await prisma.invoice.findMany()
    await migrateTable('Faturas', invoices, `agencies/${AGENCY_ID}/invoices/{id}`)

    // 5. Membros do Portal
    const members = await prisma.clientMember.findMany()
    await migrateTable('Membros do Portal', members, `agencies/${AGENCY_ID}/members/{id}`)

    console.log('\n--- ✅ MIGRAO CONCLUDO COM SUCESSO! ---')
    console.log(`Os dados agora esto disponveis em: agencies/${AGENCY_ID}/`)
  } catch (error) {
    console.error('\n--- ❌ FALHA NA MIGRAO ---')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

startMigration()
