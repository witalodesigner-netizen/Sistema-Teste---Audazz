'use server'

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { getPortalSession } from "@/lib/security/session";
import { withAudit } from "@/lib/security/audit";
import { checkPermission } from "@/lib/security/permissions";

const AGENCY_ID = "audazz-nexus";

/**
 * Server Actions - Segurança e Auditoria no Firestore
 */

export const terminateSession = withAudit(
  "Encerrar Sessão",
  "Security",
  async (sessionId: string) => {
    await checkPermission("seguranca", "manage");
    // Revogação de sessão firebase gerida pelo próprio portal-token cookie
    // Para admin: pode invalidar tokens via adminAuth.revokeRefreshTokens(uid)
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
  const session = await getPortalSession()
  if (!session) throw new Error("Não autorizado")

  let query: any = adminDb.collection('agencies').doc(AGENCY_ID).collection('auditLogs');

  if (filters.userId) query = query.where('userId', '==', filters.userId);
  if (filters.acao) query = query.where('acao', '==', filters.acao);
  if (filters.periodo) {
    query = query
      .where('createdAt', '>=', filters.periodo.from)
      .where('createdAt', '<=', filters.periodo.to);
  }

  const snapshot = await query.orderBy('createdAt', 'desc').limit(100).get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Toggle MFA - gerido no Firestore (Firebase não suporta MFA via Admin facilmente)
 */
export async function toggleMFA(enabled: boolean) {
  const session = await getPortalSession()
  if (!session) throw new Error("Não autorizado.");

  await adminDb
    .collection('agencies').doc(AGENCY_ID)
    .collection('collaborators').doc(session.uid)
    .update({ mfaEnabled: enabled });

  return { success: true };
}
