import { adminDb } from '../firebase/admin'
import { BaseRepository } from './base'

export interface WhatsappConfig {
  id: string
  agencyId: string
  instanceName: string
  apiKey: string
  serverUrl: string
  enabled: boolean
  updatedAt: Date
}

export interface WhatsappTemplate {
  id: string
  agencyId: string
  nome: string
  categoria: string
  conteudo: string
  variaveis: string[]
  createdAt: Date
}

export class WhatsappRepository extends BaseRepository {
  private collection(agencyId: string) {
    return adminDb.collection('agencies').doc(agencyId).collection('whatsappConfigs')
  }

  private templatesCollection(agencyId: string) {
    return adminDb.collection('agencies').doc(agencyId).collection('whatsappTemplates')
  }

  async getConfig(agencyId: string): Promise<WhatsappConfig | null> {
    const snapshot = await this.collection(agencyId).limit(1).get()
    if (snapshot.empty) return null
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as WhatsappConfig
  }

  async saveConfig(agencyId: string, data: Partial<WhatsappConfig>) {
    const config = await this.getConfig(agencyId)
    if (config) {
      await this.collection(agencyId).doc(config.id).update({
        ...data,
        updatedAt: new Date()
      })
    } else {
      await this.collection(agencyId).add({
        ...data,
        agencyId,
        updatedAt: new Date()
      })
    }
  }

  async createTemplate(agencyId: string, data: Partial<WhatsappTemplate>) {
    return await this.templatesCollection(agencyId).add({
      ...data,
      agencyId,
      createdAt: new Date()
    })
  }

  async getTemplates(agencyId: string): Promise<WhatsappTemplate[]> {
    const snapshot = await this.templatesCollection(agencyId).get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WhatsappTemplate[]
  }
}
