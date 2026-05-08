"use server"

import { adminDb } from "@/lib/firebase/admin"
import { revalidatePath } from "next/cache"
import { FieldValue } from "firebase-admin/firestore"
import { z } from "zod"

const AGENCY_ID = "audazz-nexus"

const MemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
})

export async function createClientMember(clientId: string, data: z.infer<typeof MemberSchema>) {
  try {
    const memberRef = adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('clients').doc(clientId)
      .collection('members').doc()

    await memberRef.set({
      ...data,
      clientId,
      status: "pendente",
      permissions: { verAprovacoes: true, aprovar: false, acessarMateriais: true },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null
    })

    revalidatePath(`/clients/${clientId}`)
    return { success: true, data: { id: memberRef.id } }
  } catch (error) {
    console.error("Error creating member:", error)
    return { success: false, error: "Falha ao criar membro" }
  }
}

export async function updateMemberPermissions(clientId: string, memberId: string, permissions: any) {
  try {
    const memberRef = adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('clients').doc(clientId)
      .collection('members').doc(memberId)

    await memberRef.update({
      permissions,
      updatedAt: FieldValue.serverTimestamp()
    })

    revalidatePath(`/clients/${clientId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Falha ao atualizar permissões" }
  }
}

export async function deleteClientMember(clientId: string, memberId: string) {
  try {
    const memberRef = adminDb
      .collection('agencies').doc(AGENCY_ID)
      .collection('clients').doc(clientId)
      .collection('members').doc(memberId)

    await memberRef.update({
      status: "inativo",
      deletedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })

    revalidatePath(`/clients/${clientId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Falha ao remover membro" }
  }
}
