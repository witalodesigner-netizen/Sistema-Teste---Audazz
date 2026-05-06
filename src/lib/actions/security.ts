"use server"

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { withAudit } from "@/lib/security/audit";
import { checkPermission } from "@/lib/security/permissions";

/**
 * Server Actions - Segurança e Auditoria
 */

/**
 * Encerra uma sessão específica do Clerk
 */
export const terminateSession = withAudit(
  "Encerrar Sessão",
  "Security",
  async (sessionId: string) => {
    await checkPermission("seguranca", "manage");
    
    const client = await clerkClient();
    await client.sessions.revokeSession(sessionId);
    
    revalidatePath("/configuracoes/seguranca");
    return { success: true };
  }
);

/**
 * Busca logs de auditoria com filtros
 */
export async function getAuditLogs(filters: {
  userId?: string;
  acao?: string;
  risco?: string;
  periodo?: { from: Date; to: Date };
}) {
  await checkPermission("seguranca", "read");

  const where: any = {};
  if (filters.userId) where.userId = filters.userId;
  if (filters.acao) where.acao = { contains: filters.acao, mode: 'insensitive' };
  if (filters.risco) where.risco = filters.risco;
  if (filters.periodo) {
    where.createdAt = {
      gte: filters.periodo.from,
      lte: filters.periodo.to,
    };
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return logs;
}

/**
 * Ativa/Desativa MFA para o usuário atual
 */
export async function toggleMFA(enabled: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado.");

  const client = await clerkClient();
  
  // No Clerk, o MFA é gerenciado pelo usuário no dashboard do Clerk, 
  // mas aqui podemos disparar a configuração ou registrar a intenção.
  // Para propósitos de sistema, vamos apenas registrar no metadata do usuário.
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      mfaEnabled: enabled
    }
  });

  return { success: true };
}
