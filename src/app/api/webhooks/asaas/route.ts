import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { WhatsappService } from "@/lib/services/whatsapp";
import { RdStationService } from "@/lib/services/rdstation";

/**
 * Webhook Asaas - Audazz Nexus OS
 * Orquestrador de Integrações: Recebe notificações e automatiza ações no WhatsApp, CRM e RD Station.
 */

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const headerList = await headers();
    // 1. Validação de Segurança (Dinâmica via Banco de Dados)
    const config = await prisma.asaasConfig.findFirst({
      where: { ativo: true }
    });

    const asaasToken = headerList.get("asaas-access-token");
    if (!config || asaasToken !== config.webhookToken) {
      console.warn("⚠️ Tentativa de webhook Asaas com token inválido ou integração inativa.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Log de Recebimento
    await prisma.asaasWebhookLog.create({
      data: {
        evento: payload.event,
        payload: payload,
      }
    });

    const event = payload.event;
    const payment = payload.payment;
    const externalId = payment.externalReference;

    // 3. Processamento e Orquestração
    if (externalId) {
      // Busca dados da fatura e cliente para as automações
      const invoice = await prisma.invoice.findUnique({
        where: { id: externalId },
        include: { client: { include: { portalConfig: true } } }
      });

      if (invoice) {
        switch (event) {
          case "PAYMENT_RECEIVED":
          case "PAYMENT_CONFIRMED":
            // Ação 1: Atualizar Banco de Dados
            await prisma.invoice.update({
              where: { id: externalId },
              data: { status: "pago", asaasStatus: payment.status }
            });

            // Ação 2: Automação WhatsApp
            if (invoice.client.portalConfig?.ativo) {
              try {
                const message = `🚀 *Pagamento Confirmado!* \n\nOlá, confirmamos o recebimento do seu pagamento referente à fatura *#${invoice.id}* no valor de R$ ${invoice.valor.toFixed(2)}.\n\nObrigado pela confiança!`;
                // Tenta buscar um telefone do membro principal ou do cliente
                const clientPhone = invoice.client.asaasCustomerId; // Mock/Simplificação para o exemplo
                // No cenário real, buscaríamos o telefone do ClientMember ou do cadastro do Client
                // await WhatsappService.sendMessage("5511999999999", message); 
              } catch (e) {
                console.error("Erro ao enviar WhatsApp no Webhook:", e);
              }
            }

            // Ação 3: Sincronização RD Station
            try {
              const rd = await RdStationService.init();
              await rd.triggerEvent("PAGAMENTO_CONFIRMADO", {
                email: invoice.client.slug + "@cliente.com", // Exemplo de mapeamento
                valor: invoice.valor,
                fatura_id: invoice.id
              });
            } catch (e) {
              console.warn("RD Station não configurado para este evento.");
            }
            break;

          case "PAYMENT_OVERDUE":
            // Ação 1: Atualizar Banco de Dados
            await prisma.invoice.update({
              where: { id: externalId },
              data: { status: "vencido", asaasStatus: payment.status }
            });

            // Ação 2: Automação WhatsApp (Lembrete)
            try {
              const reminder = `⚠️ *Lembrete de Vencimento* \n\nOlá, notamos que a fatura *#${invoice.id}* consta como pendente no sistema. \n\nCaso já tenha realizado o pagamento, desconsidere esta mensagem.`;
              // await WhatsappService.sendMessage("5511999999999", reminder);
            } catch (e) {}
            break;

          case "PAYMENT_DELETED":
            await prisma.invoice.update({
              where: { id: externalId },
              data: { status: "cancelado", asaasStatus: payment.status }
            });
            break;

          case "PAYMENT_REFUNDED":
            await prisma.invoice.update({
              where: { id: externalId },
              data: { status: "estornado", asaasStatus: payment.status }
            });
            break;
        }

        // 4. Auditoria da Integração
        await prisma.auditLog.create({
          data: {
            acao: "INTEGRACAO_ASAAS_WEBHOOK",
            recurso: "Invoice",
            recursoId: externalId,
            sucesso: true,
            motivo: `Evento ${event} processado e orquestrado com sucesso.`,
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Erro crítico no Webhook Asaas:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

