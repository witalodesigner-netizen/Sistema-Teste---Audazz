import axios, { AxiosInstance } from 'axios';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const AGENCY_ID = "audazz-nexus";

/**
 * Service RD Station - Audazz Nexus OS
 * Integração com RD Station Marketing e CRM via OAuth 2.0.
 */

export class RdStationService {
  private api: AxiosInstance;
  private configId: string;

  constructor(configId: string, accessToken: string) {
    this.configId = configId;
    this.api = axios.create({
      baseURL: 'https://api.rd.services',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para Refresh Token automático
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newAccessToken = await this.refreshToken();
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return this.api(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }

  static async init() {
    const configDoc = await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('config').doc('rdstation')
      .get();

    const config = configDoc.data();
    if (!config?.ativo || !config?.accessToken) {
      throw new Error('Integração RD Station não configurada ou inativa.');
    }

    return new RdStationService(configDoc.id, config.accessToken);
  }

  private async refreshToken(): Promise<string> {
    const configDoc = await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('config').doc('rdstation')
      .get();

    const config = configDoc.data();
    if (!config?.refreshToken) throw new Error('Refresh token não encontrado.');

    try {
      const response = await axios.post('https://api.rd.services/auth/token', {
        client_id: process.env.RDSTATION_CLIENT_ID,
        client_secret: process.env.RDSTATION_CLIENT_SECRET,
        refresh_token: config.refreshToken,
      });

      const { access_token, refresh_token, expires_in } = response.data;

      await adminDb
        .collection('agencies').doc(AGENCY_ID)
        .collection('config').doc('rdstation')
        .update({
          accessToken: access_token,
          refreshToken: refresh_token,
          tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
          updatedAt: FieldValue.serverTimestamp()
        });

      return access_token;
    } catch (error) {
      console.error('Falha ao atualizar token RD Station:', error);
      throw new Error('Falha na reautenticação com RD Station.');
    }
  }

  async syncContact(email: string, data: any) {
    const response = await this.api.patch(`/platform/contacts/email:${email}`, data);
    return response.data;
  }

  async triggerEvent(eventType: string, payload: any) {
    const response = await this.api.post('/platform/events', {
      event_type: eventType,
      payload
    });
    return response.data;
  }

  async updateOpportunity(opportunityId: string, stage: string) {
    const response = await this.api.put(`/platform/opportunities/${opportunityId}`, {
      lifecycle_stage: stage
    });
    return response.data;
  }
}
