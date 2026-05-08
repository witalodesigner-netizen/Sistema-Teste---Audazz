/**
 * Utilitrio para gerao de senhas automticas para o Portal Audazz.
 */
export function generateSystemPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

/**
 * Mapeia um CPF para o e-mail de autenticao do Firebase do Portal.
 */
export function mapCpfToEmail(cpf: string): string {
  const cleanCpf = cpf.replace(/\D/g, '')
  return `${cleanCpf}@portal.audazz.com`
}
