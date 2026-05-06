"use server"

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkPermission } from "@/lib/security/permissions";

/**
 * Server Actions - Configuração de Webhooks Asaas
 */

export async function saveAsaasWebhook(token: string) {
  try {
    await checkPermission("configuracao", "manage");

    // Atualiza ou cria a configuração principal do Asaas com o novo token de webhook
    const config = await prisma.asaasConfig.findFirst();
    
    if (config) {
      await prisma.asaasConfig.update({
        where: { id: config.id },
        data: { webhookToken: token, ativo: true }
      });
    } else {
      await prisma.asaasConfig.create({
        data: { 
          webhookToken: token, 
          apiKeyEncrypted: "pending", 
          ativo: true 
        }
      });
    }

    revalidatePath("/settings/integrations/asaas");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao salvar token de webhook:", error);
    return { success: false, error: error.message };
  }
}

export async function getAsaasWebhookToken() {
  try {
    const config = await prisma.asaasConfig.findFirst({
      select: { webhookToken: true }
    });
    return { success: true, token: config?.webhookToken || "" };
  } catch (error: any) {
    return { success: false, token: "" };
  }
}

export async function deleteAsaasWebhook(id: string) {
  try {
    await checkPermission("configuracao", "manage");
    await prisma.asaasWebhookConfig.delete({
      where: { id }
    });
    revalidatePath("/settings/integrations/asaas");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function testAsaasWebhook(token: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error || "Erro desconhecido" };
    }
  } catch (error: any) {
    return { success: false, error: "Não foi possível alcançar a URL do Webhook." };
  }
}
