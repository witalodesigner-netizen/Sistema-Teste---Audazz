"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientMemberSchema, ClientMemberValues } from "@/lib/schemas/client-member"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMembers } from "@/hooks/use-members"
import { Loader2, UserPlus } from "lucide-react"

interface ConvidarMembroModalProps {
  clientId: string
  isOpen: boolean
  onClose: () => void
}

export function ConvidarMembroModal({ clientId, isOpen, onClose }: ConvidarMembroModalProps) {
  const { isLoading, handleAddMember } = useMembers(clientId)
  
  const form = useForm<ClientMemberValues>({
    resolver: zodResolver(clientMemberSchema),
    defaultValues: {
      role: "VISUALIZADOR"
    }
  })

  const onSubmit = async (data: ClientMemberValues) => {
    const success = await handleAddMember(data)
    if (success) {
      form.reset()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-12 bg-audazz-blue/10 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-audazz-blue" />
          </div>
          <DialogTitle className="text-2xl font-bold">Convidar Membro</DialogTitle>
          <DialogDescription>
            Envie um convite de acesso para o portal do cliente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input 
              id="name" 
              placeholder="Ex: João Silva" 
              {...form.register("name")}
              className="bg-secondary/30 border-none rounded-xl"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="email@empresa.com" 
              {...form.register("email")}
              className="bg-secondary/30 border-none rounded-xl"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Cargo</Label>
              <Input 
                id="jobTitle" 
                placeholder="Ex: Diretor" 
                {...form.register("jobTitle")}
                className="bg-secondary/30 border-none rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Nível de Acesso</Label>
              <Select onValueChange={(v) => form.setValue("role", v as any)}>
                <SelectTrigger className="bg-secondary/30 border-none rounded-xl">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DONO">Dono</SelectItem>
                  <SelectItem value="GESTOR">Gestor</SelectItem>
                  <SelectItem value="VISUALIZADOR">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full min-w-[120px]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar Convite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
