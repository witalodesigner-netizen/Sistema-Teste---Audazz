"use client"

import { useState } from "react"
import { toast } from "sonner"
import { createClientAction, deleteClientAction } from "@/lib/actions/clients"

export function useClients() {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async (data: any) => {
    setIsLoading(true)
    try {
      // Garantir que agencyId seja enviado se não estiver no data
      const finalData = {
        agencyId: "audazz-nexus",
        ...data
      }
      const result = await createClientAction(finalData)
      if (result.success) {
        toast.success("Cliente cadastrado com sucesso!")
        return result
      }
      toast.error(result.error || "Erro ao cadastrar cliente")
      return false
    } catch (error: any) {
      toast.error(error.message || "Erro inesperado ao cadastrar cliente")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (clientId: string) => {
    setIsLoading(true)
    try {
      const result = await deleteClientAction("audazz-nexus", clientId)
      if (result.success) {
        toast.success("Cliente excluído com sucesso!")
        return true
      }
      toast.error(result.error || "Erro ao excluir cliente")
      return false
    } catch (error: any) {
      toast.error(error.message || "Erro inesperado ao excluir cliente")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleCreate,
    handleDelete
  }
}
