import { NextRequest, NextResponse } from "next/headers";
import { prisma } from "@/lib/db";

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
        await prisma.whatsappLog.updateMany({
          where: { metaMessageId: status.id },
          data: {
            status: status.status,
            entregueEm: status.status === "delivered" ? new Date() : undefined,
            lidaEm: status.status === "read" ? new Date() : undefined,
          }
        });
      }
    } else if (payload.event === "messages.upsert") {
      // Evolution API
      // ... processar conforme documentação Evolution
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
    const config = await prisma.whatsappConfig.findFirst({
      where: { metaWebhookToken: token }
    });

    if (config) {
      return new NextResponse(challenge);
    }
  }

  return new NextResponse("Forbidden", { status: 403 });
}
