import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Webhook RD Station - Audazz Nexus OS
 * Recebe conversões de leads e mudanças no funil.
 */

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // Log do webhook
    await prisma.rdStationWebhookLog.create({
      data: {
        tipo: "CONVERSÃO",
        payload: payload,
      }
    });

    const leads = payload.leads || [];

    for (const lead of leads) {
      // Criar ou atualizar lead no CRM local
      await prisma.rdStationLead.upsert({
        where: { id: lead.id || 'new' }, // Ajustar conforme ID do RD
        update: {
          nome: lead.name,
          telefone: lead.personal_phone,
          empresa: lead.company,
          cargo: lead.job_title,
          tags: lead.tags || [],
          updatedAt: new Date()
        },
        create: {
          email: lead.email,
          nome: lead.name,
          telefone: lead.personal_phone,
          empresa: lead.company,
          cargo: lead.job_title,
          tags: lead.tags || [],
          origem: lead.last_conversion?.source || "RD Station",
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
