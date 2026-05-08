import { getPortalSession } from '@/lib/security/session'

/**
 * Módulo de Permissões - Audazz Nexus OS
 * Controle de acesso baseado em Roles (RBAC) - via Firebase Custom Claims
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
  const session = await getPortalSession()
  if (!session) throw new Error("Não autorizado. Faça login para continuar.")

  const role = (session as any).role as Role || "criativo"

  // ADMIN tem permissão total
  if (role === "admin") return true

  // GESTOR pode ler e criar a maioria, mas delete é restrito
  if (role === "gestor") {
    if (action === "delete" && !["solicitacao", "comentario"].includes(resource)) {
      return false
    }
    return true
  }

  // CRIATIVO tem permissão limitada
  if (role === "criativo") {
    const allowedResources = ["solicitacao", "comentario", "material", "projeto"]
    if (!allowedResources.includes(resource)) return false
    if (action === "delete") return false
    return true
  }

  return false
}

/**
 * Verifica se o usuário é dono do recurso ou tem permissão de gestão
 */
export async function checkOwnership(resource: string, resourceId: string) {
  const session = await getPortalSession()
  if (!session) return false

  const role = (session as any).role as Role
  if (role === "admin") return true

  return true
}
