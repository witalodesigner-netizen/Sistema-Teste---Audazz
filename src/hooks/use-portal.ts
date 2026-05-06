"use client"

import { useState } from "react"
import { toast } from "sonner"
import { updatePortalConfig, uploadMaterial, createSolicitacao } from "@/lib/actions/client-portal"
import { PortalConfigValues, MaterialValues, SolicitacaoValues } from "@/lib/schemas/client-portal"

export function usePortal(clientId: string) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateConfig = async (data: PortalConfigValues) => {
    setIsLoading(true)
    try {
      const result = await updatePortalConfig(clientId, data)
      if (result.success) {
        toast.success("Configurações do portal salvas!")
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadMaterial = async (data: MaterialValues) => {
    setIsLoading(true)
    try {
      const result = await uploadMaterial(clientId, data)
      if (result.success) {
        toast.success("Material enviado com sucesso!")
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewSolicitacao = async (memberId: string, data: SolicitacaoValues) => {
    setIsLoading(true)
    try {
      const result = await createSolicitacao(clientId, memberId, data)
      if (result.success) {
        toast.success("Solicitação aberta com sucesso!")
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleUpdateConfig,
    handleUploadMaterial,
    handleNewSolicitacao
  }
}
