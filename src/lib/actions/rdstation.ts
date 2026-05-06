"use server"

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { RdStationService } from "@/lib/services/rdstation";
import { withAudit } from "@/lib/security/audit";
import { checkPermission } from "@/lib/security/permissions";

/**
 * Server Actions - RD Station
 */

export const saveRdStationConfig = withAudit(
  "Salvar Configuração RD",
  "RdStationConfig",
  async (data: any) => {
    await checkPermission("configuracao", "manage");

    await prisma.rdStationConfig.upsert({
      where: { id: data.id || 'new' },
      update: data,
      create: data
    });

    revalidatePath("/configuracoes/integracoes/rdstation");
    return { success: true };
  }
);

/**
 * Sincroniza um cliente com o RD Station
 */
export async function syncClientWithRd(clientId: string) {
  try {
    await checkPermission("cliente", "update");
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new Error("Cliente não encontrado.");

    const rd = await RdStationService.init();
    
    await rd.syncContact(client.slug, {
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
 * Dispara evento de conversão
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
