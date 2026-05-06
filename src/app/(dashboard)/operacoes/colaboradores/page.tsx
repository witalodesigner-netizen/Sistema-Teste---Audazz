"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Users, Plus, Search, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ColaboradorCard } from "@/components/operacoes/colaboradores/ColaboradorCard"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ColaboradorWizard } from "@/components/operacoes/colaboradores/ColaboradorWizard"
import { motion, AnimatePresence } from "framer-motion"

// Mock inicial para visualização
const collaboratorsMock = [
  { 
    id: "1", 
    nome: "Lucas Oliveira", 
    cargo: "Senior UI Designer", 
    departamento: "Design", 
    vinculo: "PJ", 
    emailProfissional: "lucas@audazz.com", 
    avatarUrl: null, 
    cidade: "São Paulo", 
    estado: "SP", 
    ativo: true, 
    podeSerAlocado: true 
  },
  { 
    id: "2", 
    nome: "Ana Beatriz", 
    cargo: "Social Media Strategist", 
    departamento: "Social Media", 
    vinculo: "CLT", 
    emailProfissional: "ana@audazz.com", 
    avatarUrl: null, 
    cidade: "Curitiba", 
    estado: "PR", 
    ativo: true, 
    podeSerAlocado: true 
  },
]

export default function CollaboratorsPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Colaboradores" 
        description="Gestão de talentos, alocação e performance da equipe."
        icon={Users}
        actions={
          <Button 
            onClick={() => setIsWizardOpen(true)}
            className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full gap-2 px-6 shadow-lg shadow-audazz-blue/20"
          >
            <Plus className="w-4 h-4" /> Novo Colaborador
          </Button>
        }
      />

      {/* Barra de Ferramentas */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, cargo ou e-mail..." 
            className="pl-10 rounded-2xl bg-secondary/30 border-none h-12 focus-visible:ring-audazz-blue/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl border-white/5 bg-secondary/20 gap-2 h-12 flex-1 md:flex-none">
            <Filter className="w-4 h-4" /> Filtrar
          </Button>
          <Button variant="outline" className="rounded-xl border-white/5 bg-secondary/20 gap-2 h-12 flex-1 md:flex-none">
            <SlidersHorizontal className="w-4 h-4" /> Ordenar
          </Button>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {collaboratorsMock.map((collab) => (
            <ColaboradorCard key={collab.id} collaborator={collab} />
          ))}
        </AnimatePresence>
      </div>

      {/* Wizard de Cadastro (Dialog centralizado) */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[95vh] border-white/5 bg-background/95 backdrop-blur-2xl p-0 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-white/10">
            <ColaboradorWizard onComplete={() => setIsWizardOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
