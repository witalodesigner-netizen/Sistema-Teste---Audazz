"use server"

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AsaasService } from "@/lib/services/asaas";
import { withAudit } from "@/lib/security/audit";
import { checkPermission } from "@/lib/security/permissions";

/**
 * Server Actions - Integração Asaas
 */

/**
 * Salva ou atualiza a configuração do Asaas
 */
export const saveAsaasConfig = withAudit(
  "Salvar Configuração",
  "AsaasConfig",
  async (data: any) => {
    await checkPermission("configuracao", "manage");

    const config = await prisma.asaasConfig.upsert({
      where: { id: data.id || 'new' },
      update: {
        apiKeyEncrypted: data.apiKey, // No crypto module for now to keep it simple as per user schema
        environment: data.environment,
        webhookToken: data.webhookToken,
        syncClientes: data.syncClientes,
        syncCobr: data.syncCobr,
        ativo: data.ativo,
      },
      create: {
        apiKeyEncrypted: data.apiKey,
        environment: data.environment,
        webhookToken: data.webhookToken,
        syncClientes: data.syncClientes,
        syncCobr: data.syncCobr,
        ativo: data.ativo,
      }
    });

    revalidatePath("/configuracoes/integracoes/asaas");
    return { success: true, config };
  }
);

/**
 * Testa a conexão com o Asaas
 */
export async function testAsaasConnection() {
  try {
    await checkPermission("configuracao", "read");
    const asaas = await AsaasService.init();
    const balance = await asaas.getBalance();
    
    // Atualiza info da conta no banco
    await prisma.asaasConfig.updateMany({
      where: { ativo: true },
      data: {
        contaSaldo: balance.balance,
        contaSaldoAt: new Date()
      }
    });

    return { success: true, balance: balance.balance };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sincroniza um cliente com o Asaas
 */
export async function syncClientWithAsaas(clientId: string) {
  try {
    await checkPermission("cliente", "update");
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new Error("Cliente não encontrado.");

    const asaas = await AsaasService.init();
    
    let asaasId = client.asaasCustomerId;

    const customerData = {
      name: client.name,
      externalReference: client.id,
      notificationDisabled: false,
    };

    if (asaasId) {
      await asaas.updateCustomer(asaasId, customerData);
    } else {
      const newCustomer = await asaas.createCustomer(customerData);
      asaasId = newCustomer.id;
      await prisma.client.update({
        where: { id: clientId },
        data: { asaasCustomerId: asaasId }
      });
    }

    revalidatePath(`/clients/${clientId}`);
    return { success: true, asaasId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Cria uma cobrança no Asaas
 */
export const createAsaasPayment = withAudit(
  "Criar Cobrança",
  "Invoice",
  async (invoiceId: string) => {
    await checkPermission("financeiro", "create");
    
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true }
    });

    if (!invoice || !invoice.client.asaasCustomerId) {
      throw new Error("Fatura ou Cliente Asaas não encontrado.");
    }

    const asaas = await AsaasService.init();
    
    const payment = await asaas.createPayment({
      customer: invoice.client.asaasCustomerId,
      billingType: "UNDEFINED", // Permite ao cliente escolher
      value: invoice.valor,
      dueDate: invoice.vencimento.toISOString().split('T')[0],
      description: invoice.descricao || `Fatura #${invoice.id}`,
      externalReference: invoice.id,
    });

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        asaasPaymentId: payment.id,
        asaasInvoiceUrl: payment.invoiceUrl,
        asaasBankSlipUrl: payment.bankSlipUrl,
        asaasStatus: payment.status
      }
    });

    revalidatePath("/financeiro");
    return { success: true, payment };
  }
);
