import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { headers } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";

const AGENCY_ID = "audazz-nexus";

/**
 * Webhook Asaas - Audazz Nexus OS
 * Orquestrador de Integrações: Recebe notificações e automatiza ações.
 */

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const headerList = await headers();

    // 1. Validação de Segurança via Firestore
    const configDoc = await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('config').doc('asaas')
      .get();

    const config = configDoc.data();
    const asaasToken = headerList.get("asaas-access-token");
    
    if (!config?.ativo || asaasToken !== config?.webhookToken) {
      console.warn("⚠️ Webhook Asaas com token inválido ou integração inativa.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Log de Recebimento
    await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('webhookLogs').doc()
      .set({
        tipo: "ASAAS",
        evento: payload.event,
        payload,
        createdAt: FieldValue.serverTimestamp()
      });

    const event = payload.event;
    const payment = payload.payment;
    const externalId = payment?.externalReference;

    // 3. Processamento
    if (externalId) {
      const invoiceRef = adminDb
        .collection('agencies').doc(AGENCY_ID)
        .collection('invoices').doc(externalId);

      const invoiceDoc = await invoiceRef.get();
      if (invoiceDoc.exists) {
        switch (event) {
          case "PAYMENT_RECEIVED":
          case "PAYMENT_CONFIRMED":
            await invoiceRef.update({
              status: "pago",
              asaasStatus: payment.status,
              paidAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp()
            });
            break;

          case "PAYMENT_OVERDUE":
            await invoiceRef.update({
              status: "vencido",
              asaasStatus: payment.status,
              updatedAt: FieldValue.serverTimestamp()
            });
            break;

          case "PAYMENT_DELETED":
            await invoiceRef.update({
              status: "cancelado",
              asaasStatus: payment.status,
              updatedAt: FieldValue.serverTimestamp()
            });
            break;

          case "PAYMENT_REFUNDED":
            await invoiceRef.update({
              status: "estornado",
              asaasStatus: payment.status,
              updatedAt: FieldValue.serverTimestamp()
            });
            break;
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Erro crítico no Webhook Asaas:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
