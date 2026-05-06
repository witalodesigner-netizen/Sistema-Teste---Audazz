"use server"

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { WhatsappService } from "@/lib/services/whatsapp";
import { withAudit } from "@/lib/security/audit";
import { checkPermission } from "@/lib/security/permissions";

/**
 * Server Actions - WhatsApp
 */

export const saveWhatsappConfig = withAudit(
  "Salvar Configuração WhatsApp",
  "WhatsappConfig",
  async (data: any) => {
    await checkPermission("configuracao", "manage");

    await prisma.whatsappConfig.upsert({
      where: { id: data.id || 'new' },
      update: data,
      create: data
    });

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
    await WhatsappService.sendMessage(phone, "Teste de conexão Audazz Nexus OS 👋");
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

    const template = await prisma.whatsappTemplate.create({
      data: {
        nome: data.nome,
        categoria: data.categoria,
        conteudo: data.conteudo,
        variaveis: data.variaveis,
      }
    });

    revalidatePath("/configuracoes/integracoes/whatsapp");
    return { success: true, template };
  }
);

/**
 * Envia notificação de nova fatura
 */
export async function notifyNewInvoice(invoiceId: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: { include: { members: true } } }
    });

    if (!invoice) throw new Error("Fatura não encontrada.");
    
    // Notifica o primeiro membro que tem WhatsApp ativo
    const member = invoice.client.members.find(m => m.whatsappNotif && m.phone);
    if (!member || !member.phone) return { success: false, error: "Nenhum membro configurado para receber WhatsApp." };

    const message = `Olá ${member.name}! Sua fatura de R$ ${invoice.valor.toLocaleString('pt-BR')} está disponível. Pague aqui: ${invoice.asaasInvoiceUrl || '#'}`;
    
    await WhatsappService.sendMessage(member.phone, message);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
