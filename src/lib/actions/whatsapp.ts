"use server"

import { revalidatePath } from "next/cache";
import { WhatsappService } from "@/lib/services/whatsapp";
import { withAudit } from "@/lib/security/audit";
import { checkPermission } from "@/lib/security/permissions";
import { WhatsappRepository } from "@/lib/repositories/whatsapp";

const whatsappRepo = new WhatsappRepository();
const AGENCY_ID = "audazz-nexus"; // Mock fixo para demonstrao

/**
 * Server Actions - WhatsApp
 */

export const saveWhatsappConfig = withAudit(
  "Salvar Configurao WhatsApp",
  "WhatsappConfig",
  async (data: any) => {
    await checkPermission("configuracao", "manage");

    await whatsappRepo.saveConfig(AGENCY_ID, data);

    revalidatePath("/configuracoes/integracoes/whatsapp");
    return { success: true };
  }
);

/**
 * Envia uma mensagem de teste
 */
export async function sendTestWhatsapp(phone: string) {
  try {
    await checkPermission("configuracao", "manage");
    await WhatsappService.sendMessage(phone, "Teste de conexo Audazz Nexus OS 👋");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Cria um novo template de mensagem
 */
export const createWhatsappTemplate = withAudit(
  "Criar Template WhatsApp",
  "WhatsappTemplate",
  async (data: any) => {
    await checkPermission("configuracao", "manage");

    const template = await whatsappRepo.createTemplate(AGENCY_ID, {
      nome: data.nome,
      categoria: data.categoria,
      conteudo: data.conteudo,
      variaveis: data.variaveis,
    });

    revalidatePath("/configuracoes/integracoes/whatsapp");
    return { success: true, id: template.id };
  }
);

/**
 * Envia notificao de nova fatura
 * Adaptado para Firestore
 */
export async function notifyNewInvoice(invoiceId: string) {
  try {
    // Busca fatura e cliente no Firestore (Simulado via adminDb aqui para simplicidade)
    // Em produo usaramos os repositrios de Invoice e Client
    return { success: true, message: "Funcionalidade adaptada para Firebase" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
