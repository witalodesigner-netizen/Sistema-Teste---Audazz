"use client"

import { useState } from "react"
import { toast } from "sonner"
import { 
  upsertCollaboratorAction, 
  registerAbsenceAction, 
  allocateProjectAction 
} from "@/lib/actions/collaborators"

export function useCollaborators() {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async (data: any) => {
    setIsLoading(true)
    try {
      const result = await upsertCollaboratorAction({
        ...data,
        agencyId: "audazz-nexus"
      })
      if (result.success) {
        toast.success("Colaborador cadastrado com sucesso!")
        return true
      }
      toast.error(result.error || "Erro ao cadastrar")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (id: string, data: any) => {
    setIsLoading(true)
    try {
      // Reutiliza o upsert para atualizao
      const result = await upsertCollaboratorAction({
        ...data,
        userId: id,
        agencyId: "audazz-nexus"
      })
      if (result.success) {
        toast.success("Dados atualizados!")
        return true
      }
      toast.error(result.error || "Erro ao atualizar")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleAbsence = async (id: string, data: any) => {
    setIsLoading(true)
    try {
      const result = await registerAbsenceAction(id, data)
      if (result.success) {
        toast.success("Ausncia registrada!")
        return true
      }
      toast.error(result.error || "Erro ao registrar ausncia")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleAllocation = async (id: string, data: any) => {
    setIsLoading(true)
    try {
      const result = await allocateProjectAction(id, data)
      if (result.success) {
        toast.success("Alocao realizada!")
        return true
      }
      toast.error(result.error || "Erro ao alocar")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleCreate,
    handleUpdate,
    handleAbsence,
    handleAllocation
  }
}
