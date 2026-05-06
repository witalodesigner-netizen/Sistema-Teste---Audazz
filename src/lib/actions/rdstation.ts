"use server"

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { RdStationService } from "@/lib/services/rdstation";
import { withAudit } from "@/lib/security/audit";
import { checkPermission } from "@/lib/security/permissions";
import { FieldValue } from "firebase-admin/firestore";

const AGENCY_ID = "audazz-nexus";

/**
 * Server Actions - RD Station no Firestore
 */

export const saveRdStationConfig = withAudit(
  "Salvar Configurao RD",
  "RdStationConfig",
  async (data: any) => {
    await checkPermission("configuracao", "manage");

    const configRef = adminDb
      .collection('agencies')
      .doc(AGENCY_ID)
      .collection('config')
      .doc('rdstation');

    await configRef.set({
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    revalidatePath("/configuracoes/integracoes/rdstation");
    return { success: true };
  }
);

/**
 * Sincroniza um cliente com o RD Station
 * Adaptado para Firestore
 */
export async function syncClientWithRd(clientId: string) {
  try {
    await checkPermission("cliente", "update");
    
    // Busca no Firestore
    const clientDoc = await adminDb.collection('agencies').doc(AGENCY_ID).collection('clients').doc(clientId).get();
    if (!clientDoc.exists) throw new Error("Cliente no encontrado.");
    
    const client = clientDoc.data()!;

    const rd = await RdStationService.init();
    
    await rd.syncContact(client.slug || clientId, {
      name: client.name,
      job_title: "Cliente Nexus OS",
      lifecycle_stage: "Client",
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Dispara evento de converso
 */
export async function triggerRdConversion(email: string, eventName: string, payload: any) {
  try {
    const rd = await RdStationService.init();
    await rd.triggerEvent(eventName, {
      email,
      ...payload
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
