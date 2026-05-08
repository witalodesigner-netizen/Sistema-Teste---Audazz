import axios, { AxiosInstance } from 'axios';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { decrypt } from '@/lib/security/crypto';

const AGENCY_ID = "audazz-nexus";

/**
 * Service WhatsApp - Audazz Nexus OS
 * Suporte híbrido: Evolution API e Meta Cloud API.
 */

export class WhatsappService {
  static async sendMessage(phone: string, text: string) {
    const configDoc = await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('config').doc('whatsapp')
      .get();
    
    const config = configDoc.data();
    if (!config?.ativo) throw new Error('WhatsApp não configurado ou inativo.');

    const formattedPhone = this.formatPhone(phone);

    if (config.modalidade === 'evolution') {
      return this.sendEvolutionMessage(config, formattedPhone, text);
    } else {
      return this.sendMetaMessage(config, formattedPhone, text);
    }
  }

  static async sendTemplate(phone: string, templateName: string, variables: string[]) {
    const configDoc = await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('config').doc('whatsapp')
      .get();
    
    const config = configDoc.data();
    if (!config?.ativo) throw new Error('WhatsApp não configurado ou inativo.');

    const formattedPhone = this.formatPhone(phone);

    if (config.modalidade === 'evolution') {
      return this.sendEvolutionMessage(config, formattedPhone, `Template: ${templateName} | Vars: ${variables.join(', ')}`);
    } else {
      return this.sendMetaTemplate(config, formattedPhone, templateName, variables);
    }
  }

  private static async sendEvolutionMessage(config: any, phone: string, text: string) {
    try {
      const response = await axios.post(`${config.evolutionUrl}/message/sendText/${config.evolutionInstance}`, {
        number: phone,
        text: text
      }, {
        headers: { 'apikey': config.evolutionApiKey }
      });
      
      await this.logMessage(phone, text, 'texto', 'sucesso');
      return response.data;
    } catch (error: any) {
      await this.logMessage(phone, text, 'texto', 'erro', error.message);
      throw new Error('Falha ao enviar via Evolution API');
    }
  }

  private static async sendMetaMessage(config: any, phone: string, text: string) {
    try {
      const response = await axios.post(`https://graph.facebook.com/v18.0/${config.metaPhoneNumberId}/messages`, {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "text",
        text: { body: text }
      }, {
        headers: { 'Authorization': `Bearer ${config.metaAccessToken}` }
      });

      await this.logMessage(phone, text, 'texto', 'sucesso', undefined, response.data.messages[0].id);
      return response.data;
    } catch (error: any) {
      await this.logMessage(phone, text, 'texto', 'erro', error.message);
      throw new Error('Falha ao enviar via Meta Cloud API');
    }
  }

  private static async sendMetaTemplate(config: any, phone: string, templateName: string, variables: string[]) {
    try {
      const components = variables.map(v => ({
        type: "body",
        parameters: [{ type: "text", text: v }]
      }));

      const response = await axios.post(`https://graph.facebook.com/v18.0/${config.metaPhoneNumberId}/messages`, {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: templateName,
          language: { code: "pt_BR" },
          components
        }
      }, {
        headers: { 'Authorization': `Bearer ${config.metaAccessToken}` }
      });

      return response.data;
    } catch (error) {
      throw new Error('Falha ao enviar template via Meta');
    }
  }

  private static formatPhone(phone: string) {
    const clean = phone.replace(/\D/g, '');
    return clean.startsWith('55') ? clean : `55${clean}`;
  }

  private static async logMessage(phone: string, content: string, tipo: string, status: string, erro?: string, metaId?: string) {
    await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('whatsappLogs').doc()
      .set({
        telefone: phone,
        conteudo: content,
        tipo,
        status,
        erro: erro || null,
        metaMessageId: metaId || null,
        createdAt: FieldValue.serverTimestamp()
      });
  }
}
