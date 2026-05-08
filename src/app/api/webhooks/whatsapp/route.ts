import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const AGENCY_ID = "audazz-nexus";

/**
 * Webhook WhatsApp - Audazz Nexus OS
 * Recebe status de entrega e leitura das mensagens.
 */

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // Identifica se é Meta ou Evolution pelo payload
    if (payload.object === "whatsapp_business_account") {
      // Meta Cloud API
      const entry = payload.entry?.[0];
      const change = entry?.changes?.[0];
      const status = change?.value?.statuses?.[0];

      if (status) {
        // Busca o log pelo metaMessageId e atualiza
        const snapshot = await adminDb
          .collection('agencies').doc(AGENCY_ID)
          .collection('whatsappLogs')
          .where('metaMessageId', '==', status.id)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          await snapshot.docs[0].ref.update({
            status: status.status,
            entregueEm: status.status === "delivered" ? FieldValue.serverTimestamp() : null,
            lidaEm: status.status === "read" ? FieldValue.serverTimestamp() : null,
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET para verificação de Webhook da Meta
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode && token) {
    const configDoc = await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('config').doc('whatsapp')
      .get();

    const config = configDoc.data();
    if (config?.metaWebhookToken === token) {
      return new NextResponse(challenge);
    }
  }

  return new NextResponse("Forbidden", { status: 403 });
}
