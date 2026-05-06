"use client"

import { useState } from "react"
import { MembroCard } from "./MembroCard"
import { ConvidarMembroModal } from "./ConvidarMembroModal"
import { Button } from "@/components/ui/button"
import { Plus, Search, Users, ShieldAlert } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"

interface MembrosTabProps {
  clientId: string
  initialMembers?: any[]
}

export function MembrosTab({ clientId, initialMembers = [] }: MembrosTabProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [members, setMembers] = useState(initialMembers)

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-secondary/10 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 space-y-8">
      {/* Header da Aba */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
            <Users className="w-5 h-5 text-audazz-blue" />
            Membros do Portal
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Gerencie quem tem acesso ao painel do cliente e seus níveis de permissão.
          </p>
        </div>

        <Button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full gap-2 w-full md:w-auto"
        >
          <Plus className="w-4 h-4" /> Convidar Membro
        </Button>
      </div>

      {/* Filtros */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar membro por nome ou e-mail..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl bg-secondary/30 border-none"
        />
      </div>

      {/* Grid de Membros */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member) => (
              <MembroCard 
                key={member.id} 
                member={member}
                onEditPermissions={() => {}} 
                onDelete={() => {}}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center space-y-4 bg-secondary/5 rounded-3xl border-2 border-dashed border-white/5"
        >
          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg">Nenhum membro encontrado</h4>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Neste momento não há membros cadastrados ou que correspondam à sua busca.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsInviteModalOpen(true)}
            className="rounded-full border-white/10"
          >
            Convidar o primeiro membro
          </Button>
        </motion.div>
      )}

      {/* Modais */}
      <ConvidarMembroModal 
        clientId={clientId}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  )
}
