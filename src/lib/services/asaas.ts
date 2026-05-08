import axios, { AxiosInstance } from 'axios';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { decrypt } from '@/lib/security/crypto';

const AGENCY_ID = "audazz-nexus";

const ASAAS_SANDBOX_URL = 'https://sandbox.asaas.com/api/v3';
const ASAAS_PRODUCTION_URL = 'https://api.asaas.com/api/v3';

/**
 * Service Asaas - Audazz Nexus OS
 * Integração completa com a API v3 do Asaas.
 */

export class AsaasService {
  private api: AxiosInstance;
  private environment: 'sandbox' | 'production';

  constructor(apiKey: string, environment: 'sandbox' | 'production' = 'sandbox') {
    this.environment = environment;
    this.api = axios.create({
      baseURL: environment === 'sandbox' ? ASAAS_SANDBOX_URL : ASAAS_PRODUCTION_URL,
      headers: {
        'access_token': apiKey,
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para logs e tratamento de erros
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        
        // Log de erro no Firestore
        try {
          await adminDb
            .collection('agencies').doc(AGENCY_ID)
            .collection('apiLogs').doc()
            .set({
              tipo: 'ASAAS',
              metodo: error.config?.method?.toUpperCase() || 'UNKNOWN',
              endpoint: error.config?.url || 'UNKNOWN',
              statusCode: status || 500,
              erro: error.response?.data?.errors?.[0]?.description || error.message,
              createdAt: FieldValue.serverTimestamp()
            });
        } catch (logErr) {
          console.warn('Falha ao logar erro Asaas:', logErr);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  static async init() {
    const configDoc = await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('config').doc('asaas')
      .get();

    const config = configDoc.data();
    if (!config?.ativo) {
      throw new Error('Configuração do Asaas não encontrada ou inativa.');
    }

    const apiKey = config.apiKeyEncrypted 
      ? decrypt(config.apiKeyEncrypted)
      : process.env.ASAAS_API_KEY || '';
    
    return new AsaasService(apiKey, config.environment as 'sandbox' | 'production');
  }

  // --- CLIENTES ---

  async createCustomer(data: any) {
    const response = await this.api.post('/customers', data);
    return response.data;
  }

  async updateCustomer(id: string, data: any) {
    const response = await this.api.put(`/customers/${id}`, data);
    return response.data;
  }

  async getCustomer(id: string) {
    const response = await this.api.get(`/customers/${id}`);
    return response.data;
  }

  // --- COBRANÇAS ---

  async createPayment(data: any) {
    const response = await this.api.post('/payments', data);
    return response.data;
  }

  async getPayment(id: string) {
    const response = await this.api.get(`/payments/${id}`);
    return response.data;
  }

  async deletePayment(id: string) {
    const response = await this.api.delete(`/payments/${id}`);
    return response.data;
  }

  async getPixQrCode(id: string) {
    const response = await this.api.get(`/payments/${id}/pixQrCode`);
    return response.data;
  }

  // --- ASSINATURAS ---

  async createSubscription(data: any) {
    const response = await this.api.post('/subscriptions', data);
    return response.data;
  }

  // --- FINANCEIRO ---

  async getBalance() {
    const response = await this.api.get('/finance/balance');
    return response.data;
  }

  private handleError(error: any) {
    const message = error.response?.data?.errors?.[0]?.description || 'Erro na comunicação com o Asaas.';
    return new Error(message);
  }
}
