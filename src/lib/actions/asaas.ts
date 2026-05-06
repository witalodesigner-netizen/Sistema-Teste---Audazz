"use server"

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { AsaasService } from "@/lib/services/asaas";
import { withAudit } from "@/lib/security/audit";
import { checkPermission } from "@/lib/security/permissions";
import { encrypt } from "@/lib/security/crypto";
import { FieldValue } from "firebase-admin/firestore";

const AGENCY_ID = "audazz-nexus";

/**
 * Salva ou atualiza a configurao do Asaas no Firestore
 */
export const saveAsaasConfig = withAudit(
  "Salvar Configurao",
  "AsaasConfig",
  async (data: any) => {
    await checkPermission("configuracao", "manage");

    const configRef = adminDb
      .collection('agencies')
      .doc(AGENCY_ID)
      .collection('config')
      .doc('asaas');

    await configRef.set({
      apiKeyEncrypted: data.apiKey ? encrypt(data.apiKey) : undefined,
      environment: data.environment,
      webhookToken: data.webhookToken,
      syncClientes: data.syncClientes,
      syncCobr: data.syncCobr,
      ativo: data.ativo,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    revalidatePath("/configuracoes/integracoes/asaas");
    return { success: true };
  }
);

/**
 * Testa a conexo com o Asaas
 */
export async function testAsaasConnection() {
  try {
    await checkPermission("configuracao", "read");
    const asaas = await AsaasService.init();
    const balance = await asaas.getBalance();
    
    // Atualiza info da conta no Firestore
    const configRef = adminDb.collection('agencies').doc(AGENCY_ID).collection('config').doc('asaas');
    await configRef.update({
      contaSaldo: balance.balance,
      contaSaldoAt: FieldValue.serverTimestamp()
    });

    return { success: true, balance: balance.balance };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
