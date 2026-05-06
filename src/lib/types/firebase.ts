import { Timestamp } from 'firebase/firestore'

/**
 * Tipo Utilitrio para Datas no Firebase.
 * No servidor (Admin SDK) recebemos Timestamp.
 * No cliente (aps o converter) recebemos Date.
 */
export type FirestoreTimestamp = Timestamp | Date

// --- ENUMS ---

export enum UserRole {
  ADMIN = 'admin',
  GESTOR = 'gestor',
  CRIATIVO = 'criativo'
}

export enum ClientStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  LEAD = 'lead',
  ARQUIVADO = 'arquivado',
  PROSPECTO = 'prospecto',
  PROPOSTA = 'proposta',
  PERDIDO = 'perdido'
}

export enum ProjectStatus {
  BRIEFING = 'briefing',
  PRODUCAO = 'producao',
  REVISAO = 'revisao',
  APROVACAO = 'aprovacao',
  CONCLUIDO = 'concluido',
  PAUSADO = 'pausado'
}

export enum ApprovalStatus {
  PENDENTE = 'pendente',
  VISUALIZADO = 'visualizado',
  APROVADO = 'aprovado',
  APROVADO_RESSALVA = 'aprovadoComRessalva',
  ALTERACAO = 'alteracaoSolicitada',
  EXPIRADO = 'expirado'
}

// --- INTERFACES DE BASE ---

export interface BaseDocument {
  id?: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
  deletedAt: FirestoreTimestamp | null
}

// --- AGNCIAS ---

export interface Agency extends BaseDocument {
  name: string
  slug: string
  logoUrl?: string
  logoDarkUrl?: string
  primaryColor?: string
  cnpj?: string
  address?: any
  phone?: string
  email?: string
  website?: string
  plan: 'basic' | 'pro' | 'enterprise'
}

// --- USURIOS INTERNOS ---

export interface InternalUser extends BaseDocument {
  clerkId: string
  name: string
  email: string
  avatarUrl?: string | null
  role: UserRole
  cargo?: string
  phone?: string
  status: 'ativo' | 'inativo'
  lastAccessAt?: FirestoreTimestamp
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: boolean
  }
}

// --- CLIENTES ---

export interface Client extends BaseDocument {
  agencyId: string
  name: string
  tradeName?: string
  cnpj?: string
  cpf?: string
  segment?: string
  responsibleUserId: string
  responsibleUserName: string
  origin?: string
  tags: string[]
  status: ClientStatus
  monthlyValue?: number
  logoUrl?: string | null
  website?: string
  notes?: string
  startDate?: FirestoreTimestamp
  asaasCustomerId?: string
  rdContactId?: string
  address: {
    cep?: string
    street?: string
    number?: string
    complement?: string
    district?: string
    city?: string
    state?: string
  }
}

// --- PROJETOS ---

export interface Project extends BaseDocument {
  agencyId: string
  name: string
  clientId: string
  clientName: string
  type: string
  briefing?: string
  responsibleId: string
  responsibleName: string
  team: Array<{ userId: string; userName: string; role: string }>
  startDate?: FirestoreTimestamp
  deadline?: FirestoreTimestamp
  status: ProjectStatus
  priority: 'baixa' | 'media' | 'alta' | 'urgente'
  budgetEstimated?: number
  budgetRealized?: number
  tags: string[]
  deliverables: Array<{ id: string; name: string; done: boolean }>
  totalApprovals: number
  totalRevisions: number
  searchTokens: string[]
}

// --- APROVAES ---

export interface Approval extends BaseDocument {
  agencyId: string
  projectId: string
  projectName: string
  clientId: string
  clientName: string
  version: number
  token: string
  message?: string
  deadline?: FirestoreTimestamp
  status: ApprovalStatus
  generalFeedback?: string
  expiresAt?: FirestoreTimestamp
  viewedAt?: FirestoreTimestamp
  respondedAt?: FirestoreTimestamp
  respondedByName?: string
  respondedByEmail?: string
}

// --- FINANCEIRO ---

export interface Invoice extends BaseDocument {
  agencyId: string
  number: string
  clientId: string
  clientName: string
  projectId?: string
  projectName?: string
  description: string
  value: number
  dueDate: FirestoreTimestamp
  paidAt?: FirestoreTimestamp
  paymentMethod?: string
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado' | 'estornado'
  asaasPaymentId?: string
  asaasInvoiceUrl?: string
}

// --- COLABORADORES ---

export interface Collaborator extends BaseDocument {
  agencyId: string
  userId: string // Clerk ID
  name: string
  emailProfissional: string
  whatsapp?: string
  cargo: string
  departamento: string
  ativo: boolean
  dataEntrada: FirestoreTimestamp
  searchTokens: string[]
  // Campos sensveis (sero salvos criptografados - strings no Firestore)
  cpfEncrypted?: string
  salarioMensalEncrypted?: string
}

// --- LOGS DE AUDITORIA ---

export interface AuditLog {
  id?: string
  agencyId: string
  userId: string
  userEmail: string
  userRole: string
  ipAddress: string
  acao: string
  recurso: string
  recursoId?: string
  dadosAntes?: any
  dadosDepois?: any
  sucesso: boolean
  createdAt: FirestoreTimestamp
}

// --- CONFIGURAES DE INTEGRAO ---

export interface IntegrationConfig extends BaseDocument {
  agencyId: string
  type: 'asaas' | 'whatsapp' | 'rdstation'
  ativo: boolean
  // Usar campos criptografados para chaves
  apiKeyEncrypted?: string
  environment?: 'sandbox' | 'production'
}

/**
 * TIPOS DE UTILITRIOS PARA OPERAES (CRUD)
 */
export type WithId<T> = T & { id: string }
export type CreateData<T> = Omit<T, keyof BaseDocument>
export type UpdateData<T> = Partial<CreateData<T>>
