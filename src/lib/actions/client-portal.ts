"use server"

import { adminDb } from "@/lib/firebase/admin"
import { revalidatePath } from "next/cache"
import { FieldValue } from "firebase-admin/firestore"

const AGENCY_ID = "audazz-nexus"

export async function updatePortalConfig(clientId: string, data: any) {
  try {
    const configRef = adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('clients').doc(clientId)
      .collection('config').doc('portal')

    await configRef.set({
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true })

    revalidatePath(`/clients/${clientId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Falha ao salvar configurações" }
  }
}

export async function uploadMaterial(clientId: string, data: any) {
  try {
    const materialRef = adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('clients').doc(clientId)
      .collection('materials').doc()

    await materialRef.set({
      ...data,
      clientId,
      uploadedBy: "Admin",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })

    revalidatePath(`/clients/${clientId}`)
    return { success: true, data: { id: materialRef.id } }
  } catch (error) {
    return { success: false, error: "Falha ao enviar material" }
  }
}

export async function createSolicitacao(clientId: string, memberId: string, data: any) {
  try {
    const solicitacaoRef = adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('clients').doc(clientId)
      .collection('solicitacoes').doc()

    await solicitacaoRef.set({
      ...data,
      clientId,
      memberId,
      status: "aberta",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })

    revalidatePath(`/portal/${clientId}/solicitacoes`)
    return { success: true, data: { id: solicitacaoRef.id } }
  } catch (error) {
    return { success: false, error: "Falha ao criar solicitação" }
  }
}
