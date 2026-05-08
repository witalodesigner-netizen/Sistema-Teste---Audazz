import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const AGENCY_ID = "audazz-nexus";

/**
 * Webhook RD Station - Audazz Nexus OS
 * Recebe conversões de leads e mudanças no funil.
 */

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // Log do webhook
    await adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('webhookLogs').doc()
      .set({
        tipo: "RDSTATION",
        payload,
        createdAt: FieldValue.serverTimestamp()
      });

    const leads = payload.leads || [];

    for (const lead of leads) {
      if (!lead.email) continue;

      // Cria ou atualiza lead no CRM local via Firestore
      const leadRef = adminDb
        .collection('agencies').doc(AGENCY_ID)
        .collection('leads').doc(lead.id || lead.email.replace(/[@.]/g, '_'));

      await leadRef.set({
        id: lead.id,
        email: lead.email,
        nome: lead.name,
        telefone: lead.personal_phone || null,
        empresa: lead.company || null,
        cargo: lead.job_title || null,
        tags: lead.tags || [],
        origem: lead.last_conversion?.source || "RD Station",
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp()
      }, { merge: true });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
