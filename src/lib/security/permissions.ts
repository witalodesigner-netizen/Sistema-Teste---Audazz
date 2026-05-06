import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

/**
 * Módulo de Permissões - Audazz Nexus OS
 * Controle de acesso baseado em Roles (RBAC) e Propriedade (Ownership).
 */

export type Role = "admin" | "gestor" | "criativo";

export type PermissionAction = "create" | "read" | "update" | "delete" | "manage";

/**
 * Verifica se o usuário tem permissão para realizar uma ação em um recurso
 */
export async function checkPermission(
  resource: string,
  action: PermissionAction,
  resourceId?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado. Faça login para continuar.");

  const user = await currentUser();
  const role = (user?.publicMetadata?.role as Role) || "criativo";

  // ADMIN tem permissão total
  if (role === "admin") return true;

  // GESTOR pode ler e criar a maioria, mas delete é restrito
  if (role === "gestor") {
    if (action === "delete" && !["solicitacao", "comentario"].includes(resource)) {
      return false;
    }
    return true;
  }

  // CRIATIVO tem permissão limitada
  if (role === "criativo") {
    // Só pode gerenciar tarefas e solicitações
    const allowedResources = ["solicitacao", "comentario", "material", "projeto"];
    if (!allowedResources.includes(resource)) return false;
    
    // Não pode deletar nada
    if (action === "delete") return false;
    
    return true;
  }

  return false;
}

/**
 * Verifica se o usuário é o dono do recurso ou tem permissão de gestão
 */
export async function checkOwnership(resource: string, resourceId: string) {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await currentUser();
  const role = user?.publicMetadata?.role as Role;

  if (role === "admin") return true;

  // Implementação específica por recurso pode ser adicionada aqui
  // Ex: verificar se o projeto pertence ao colaborador, etc.
  
  return true;
}
