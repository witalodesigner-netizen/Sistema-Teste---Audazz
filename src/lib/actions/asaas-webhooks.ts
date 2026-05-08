"use server"

import { adminDb } from "@/lib/firebase/admin"
import { revalidatePath } from "next/cache"
import { FieldValue } from "firebase-admin/firestore"
import { checkPermission } from "@/lib/security/permissions"

const AGENCY_ID = "audazz-nexus"

export async function saveAsaasWebhook(token: string) {
  try {
    await checkPermission("configuracao", "manage")

    const configRef = adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('config').doc('asaas')

    await configRef.set({
      webhookToken: token,
      ativo: true,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true })

    revalidatePath("/settings/integrations/asaas")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao salvar token de webhook:", error)
    return { success: false, error: error.message }
  }
}

export async function getAsaasWebhookToken() {
  try {
    const doc = await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('config').doc('asaas')
      .get()

    return { success: true, token: doc.data()?.webhookToken || "" }
  } catch (error: any) {
    return { success: false, token: "" }
  }
}

export async function deleteAsaasWebhook(id: string) {
  try {
    await checkPermission("configuracao", "manage")

    await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('webhooks').doc(id)
      .delete()

    revalidatePath("/settings/integrations/asaas")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function testAsaasWebhook(token: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/webhooks/asaas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "asaas-access-token": token
      },
      body: JSON.stringify({
        event: "WEBHOOK_TEST",
        payment: {
          id: "test_payment_id",
          status: "CONFIRMED",
          externalReference: "test_ref"
        }
      })
    })

    if (response.ok) {
      return { success: true }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.error || "Erro desconhecido" }
    }
  } catch (error: any) {
    return { success: false, error: "Não foi possível alcançar a URL do Webhook." }
  }
}
