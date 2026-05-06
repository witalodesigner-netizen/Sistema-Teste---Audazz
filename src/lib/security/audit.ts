import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";

/**
 * Sistema de Auditoria Universal - Audazz Nexus OS
 * Registra todas as ações críticas para conformidade e segurança.
 */

type AuditAction = {
  acao: string;
  recurso: string;
  recursoId?: string;
  dadosAntes?: any;
  dadosDepois?: any;
  sucesso: boolean;
  motivo?: string;
  risco?: "baixo" | "medio" | "alto" | "critico";
};

/**
 * Registra um log de auditoria no banco de dados
 */
export async function createAuditLog(params: AuditAction) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const headerList = await headers();
    
    const ipAddress = headerList.get("x-forwarded-for") || "unknown";
    const userAgent = headerList.get("user-agent") || "unknown";

    await prisma.auditLog.create({
      data: {
        userId: userId || "unauthenticated",
        userEmail: user?.emailAddresses[0]?.emailAddress || "unknown",
        userRole: (user?.publicMetadata?.role as string) || "unknown",
        ipAddress,
        userAgent,
        acao: params.acao,
        recurso: params.recurso,
        recursoId: params.recursoId,
        dadosAntes: params.dadosAntes ? JSON.parse(JSON.stringify(params.dadosAntes)) : null,
        dadosDepois: params.dadosDepois ? JSON.parse(JSON.stringify(params.dadosDepois)) : null,
        sucesso: params.sucesso,
        motivo: params.motivo,
        risco: params.risco || "baixo",
      },
    });
  } catch (error) {
    // Falha silenciosa no log para não quebrar a aplicação, mas loga no console
    console.error("❌ Falha ao criar Audit Log:", error);
  }
}

/**
 * Wrapper para Server Actions que adiciona auditoria automática
 */
export function withAudit<T extends (...args: any[]) => Promise<any>>(
  actionName: string,
  resourceName: string,
  fn: T
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      const result = await fn(...args);
      
      await createAuditLog({
        acao: actionName,
        recurso: resourceName,
        sucesso: true,
        risco: "baixo"
      });

      return result;
    } catch (error: any) {
      await createAuditLog({
        acao: actionName,
        recurso: resourceName,
        sucesso: false,
        motivo: error.message,
        risco: "medio"
      });
      throw error;
    }
  };
}
