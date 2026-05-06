import { adminDb } from '../firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Registra uma ao crtica no log de auditoria da agncia.
 * Este log  imutvel por regras de segurana e serve para conformidade.
 */
export async function logAudit(data: {
  agencyId: string
  userId: string
  userEmail: string
  userRole: string
  acao: string
  recurso: string
  recursoId?: string
  dadosAntes?: any
  dadosDepois?: any
  sucesso: boolean
  motivo?: string
  ipAddress?: string
  userAgent?: string
}) {
  try {
    // Sanitizao básica de dados para evitar campos undefined
    const cleanData = JSON.parse(JSON.stringify(data))

    await adminDb
      .collection('agencies')
      .doc(data.agencyId)
      .collection('auditLogs')
      .add({
        ...cleanData,
        createdAt: FieldValue.serverTimestamp()
      })
  } catch (error) {
    console.error("Falha ao registrar log de auditoria:", error)
    // No lanamos o erro para no interromper a operao principal, 
    // apenas logamos a falha no console do servidor.
  }
}

/**
 * Wrapper HOC para Server Actions que registra automaticamente auditoria.
 */
export function withAudit<T extends (...args: any[]) => Promise<any>>(
  acao: string,
  recurso: string,
  fn: T
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Nota: Em um ambiente real, pegaramos o usurio da sesso (ex: Clerk)
    // Aqui usaremos dados genricos para demonstrao do log
    const mockUser = {
      agencyId: 'audazz-nexus',
      userId: 'system',
      userEmail: 'admin@audazz.com',
      userRole: 'admin'
    }

    try {
      const result = await fn(...args)
      
      await logAudit({
        ...mockUser,
        acao,
        recurso,
        sucesso: true,
        dadosDepois: args[0] // Assume o primeiro argumento como input
      })

      return result
    } catch (error: any) {
      await logAudit({
        ...mockUser,
        acao,
        recurso,
        sucesso: false,
        motivo: error.message
      })
      throw error
    }
  }
}
