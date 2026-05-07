import { adminAuth } from './admin'

/**
 * Lado do Servidor: Valida o token do portal e extrai os Custom Claims.
 * Esta função deve ser chamada APENAS em Server Components, API Routes ou Middleware (Proxy).
 */
export async function validatePortalToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    return {
      uid: decodedToken.uid,
      agencyId: decodedToken.agencyId,
      clientId: decodedToken.clientId,
      memberId: decodedToken.memberId,
      role: decodedToken.role,
      isValid: true
    }
  } catch (error) {
    console.error("Token do portal inválido:", error)
    return { isValid: false }
  }
}
