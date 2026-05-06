"use client"

import { useState } from "react"
import { toast } from "sonner"
import { createClientMember, updateMemberPermissions, deleteClientMember } from "@/lib/actions/client-members"
import { ClientMemberValues } from "@/lib/schemas/client-member"

export function useMembers(clientId: string) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddMember = async (data: ClientMemberValues) => {
    setIsLoading(true)
    try {
      const result = await createClientMember(clientId, data)
      if (result.success) {
        toast.success("Convite enviado com sucesso!")
        return true
      } else {
        toast.error(result.error || "Erro ao convidar membro")
        return false
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePermissions = async (memberId: string, permissions: any) => {
    setIsLoading(true)
    try {
      const result = await updateMemberPermissions(memberId, permissions)
      if (result.success) {
        toast.success("Permissões atualizadas!")
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    setIsLoading(true)
    try {
      const result = await deleteClientMember(memberId)
      if (result.success) {
        toast.success("Membro removido!")
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleAddMember,
    handleUpdatePermissions,
    handleDeleteMember
  }
}
