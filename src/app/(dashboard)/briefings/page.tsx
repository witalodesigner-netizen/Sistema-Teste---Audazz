"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { Briefcase, Plus, Search, Filter, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"

const briefings = [
  { id: "BF-001", title: "Redesign E-commerce", client: "Fashion Nova", date: "02 Mai 2026", status: "Aprovado", priority: "Alta" },
  { id: "BF-002", title: "Campanha Black Friday", client: "TechStore", date: "04 Mai 2026", status: "Em Revisão", priority: "Média" },
  { id: "BF-003", title: "Branding Studio", client: "ArtVibe", date: "05 Mai 2026", status: "Pendente", priority: "Alta" },
  { id: "BF-004", title: "Social Media Pack", client: "FitLife", date: "05 Mai 2026", status: "Em Criação", priority: "Baixa" },
]

const statusColors: Record<string, string> = {
  "Aprovado": "bg-green-500/10 text-green-500 border-green-500/20",
  "Em Revisão": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Pendente": "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
  "Em Criação": "bg-audazz-blue/10 text-audazz-blue border-audazz-blue/20",
}

export default function BriefingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <PageHeader 
        title="Briefings" 
        description="Gestão e aprovação de briefings criativos"
        icon={Briefcase}
        actions={
          <Button className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full gap-2">
            <Plus className="w-4 h-4" /> Novo Briefing
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar briefing ou cliente..." className="pl-10 rounded-xl bg-secondary/30 border-none" />
        </div>
        <Button variant="outline" className="rounded-xl gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4" /> Filtros
        </Button>
      </div>

      <div className="grid gap-4">
        {briefings.map((bf, i) => (
          <motion.div
            key={bf.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/briefings/${bf.id}`}>
              <Card className="border-none shadow-sm hover:bg-secondary/20 transition-all cursor-pointer group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-muted-foreground tracking-widest">{bf.id}</span>
                      <h3 className="font-bold text-lg group-hover:text-audazz-blue transition-colors">{bf.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{bf.client}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden lg:flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prioridade</span>
                      <span className={`text-xs font-bold ${bf.priority === 'Alta' ? 'text-red-500' : 'text-foreground'}`}>{bf.priority}</span>
                    </div>
                    
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Data</span>
                      <span className="text-xs font-bold">{bf.date}</span>
                    </div>

                    <Badge variant="outline" className={`rounded-full px-4 py-1 border ${statusColors[bf.status]}`}>
                      {bf.status}
                    </Badge>

                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
