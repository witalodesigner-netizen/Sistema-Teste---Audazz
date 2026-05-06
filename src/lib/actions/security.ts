"use server"

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { withAudit } from "@/lib/security/audit";
import { checkPermission } from "@/lib/security/permissions";

const AGENCY_ID = "audazz-nexus";

/**
 * Server Actions - Segurana e Auditoria no Firestore
 */

export const terminateSession = withAudit(
  "Encerrar Sesso",
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
 * Busca logs de auditoria no Firestore
 */
export async function getAuditLogs(filters: {
  userId?: string;
  acao?: string;
  risco?: string;
  periodo?: { from: Date; to: Date };
}) {
  await checkPermission("seguranca", "read");

  let query: any = adminDb.collection('agencies').doc(AGENCY_ID).collection('auditLogs');

  if (filters.userId) query = query.where('userId', '==', filters.userId);
  if (filters.acao) query = query.where('acao', '==', filters.acao);
  if (filters.periodo) {
    query = query.where('createdAt', '>=', filters.periodo.from)
                 .where('createdAt', '<=', filters.periodo.to);
  }

  const snapshot = await query.orderBy('createdAt', 'desc').limit(100).get();

  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Ativa/Desativa MFA para o usurio atual
 */
export async function toggleMFA(enabled: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado.");

  const client = await clerkClient();
  
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      mfaEnabled: enabled
    }
  });

  return { success: true };
}
