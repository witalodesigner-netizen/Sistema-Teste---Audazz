"use client"

import { useState } from "react"
import { toast } from "sonner"
import { createCollaborator, updateCollaborator, registerAbsence, allocateProject } from "@/lib/actions/collaborators"
import { CollaboratorFullValues } from "@/lib/schemas/collaborator"

export function useCollaborators() {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async (data: CollaboratorFullValues) => {
    setIsLoading(true)
    try {
      const result = await createCollaborator(data)
      if (result.success) {
        toast.success("Colaborador cadastrado com sucesso!")
        return result.data
      }
      toast.error(result.error || "Erro ao cadastrar")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (id: string, data: any) => {
    setIsLoading(true)
    try {
      const result = await updateCollaborator(id, data)
      if (result.success) {
        toast.success("Dados atualizados!")
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleAbsence = async (id: string, data: any) => {
    setIsLoading(true)
    try {
      const result = await registerAbsence(id, data)
      if (result.success) {
        toast.success("Ausência registrada!")
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleAllocation = async (id: string, data: any) => {
    setIsLoading(true)
    try {
      const result = await allocateProject(id, data)
      if (result.success) {
        toast.success("Alocação realizada!")
        return true
      }
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
