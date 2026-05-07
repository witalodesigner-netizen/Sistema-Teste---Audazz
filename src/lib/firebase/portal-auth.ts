import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  getIdToken,
  User as FirebaseUser
} from 'firebase/auth'
import { auth } from './client'
import { mapCpfToEmail } from '../security/passwords'

/**
 * Realiza o login do membro no Portal do Cliente via CPF e Senha.
 * O CPF  mapeado para o e-mail de autenticao do Firebase.
 * 
 * @param cpf CPF do membro (com ou sem formatao)
 * @param password Senha gerada pelo sistema
 */
export async function signInWithCpf(cpf: string, password: string) {
  try {
    const virtualEmail = mapCpfToEmail(cpf)
    
    const userCredential = await signInWithEmailAndPassword(auth, virtualEmail, password)
    return { success: true, user: userCredential.user }
  } catch (error: any) {
    console.error("Erro no login via CPF:", error)
    return { success: false, error: error.code || error.message }
  }
}

/**
 * Realiza o login do membro no Portal do Cliente via Firebase Auth.
 * 
 * @param email Email do membro
 * @param password Senha
 * @param clienteSlug Opcional - pode ser usado para validar se o membro pertence ao portal correto
 */
export async function signInMember(email: string, password: string, clienteSlug?: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Podemos realizar uma validao extra aqui via slug se necessrio
    return { success: true, user: userCredential.user }
  } catch (error: any) {
    console.error("Erro no login do portal:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Encerra a sesso do membro no portal.
 */
export async function signOutMember() {
  await signOut(auth)
}

/**
 * Hook/Listener para monitorar o estado da autenticao no browser.
 */
export function onMemberStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}

/**
 * Recupera o token de ID atual do membro, forando a atualizao se necessrio.
 * til para enviar nos headers de requisies API.
 */
export async function getMemberToken(forceRefresh = false) {
  if (auth.currentUser) {
    return await getIdToken(auth.currentUser, forceRefresh)
  }
  return null
}

// Server-side validation moved to portal-auth-server.ts to avoid client-side bundling issues.
