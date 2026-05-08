"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Users, Plus, Search, Mail, Phone, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ClientWizard } from "@/components/clients/ClientWizard"
import Link from "next/link"

const clients = [
  { id: "CL-001", name: "TechFlow Solutions", contact: "Ricardo Santos", email: "ricardo@techflow.com", revenue: "R$ 150k/ano", status: "Ativo", icon: "TF" },
  { id: "CL-002", name: "LuxGlow Beauty", contact: "Mariana Lima", email: "mariana@luxglow.com", revenue: "R$ 45k/ano", status: "Ativo", icon: "LG" },
  { id: "CL-003", name: "VibeStudio Motion", contact: "Carlos Eduardo", email: "cadu@vibestudio.com", revenue: "R$ 80k/ano", status: "Inativo", icon: "VS" },
  { id: "CL-004", name: "EcoGreen Org", contact: "Julia Pereira", email: "julia@ecogreen.org", revenue: "R$ 30k/ano", status: "Ativo", icon: "EG" },
]

export default function ClientsPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clientes" 
        description="Gestão de base de clientes e parceiros"
        icon={Users}
        actions={
          <Button 
            onClick={() => setIsWizardOpen(true)}
            className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Cliente
          </Button>
        }
      />

      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="sm:max-w-2xl border-white/5 bg-background/95 backdrop-blur-2xl p-0 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="sr-only">
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>Wizard para cadastro de novos clientes.</DialogDescription>
          </div>
          <ClientWizard onComplete={() => setIsWizardOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar cliente..." className="pl-10 rounded-xl bg-secondary/30 border-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clients.map((client, i) => (
          <motion.div
            key={client.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/clients/${client.id}`}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group bg-secondary/10">
                <CardContent className="p-6 text-center space-y-4">
                  <Avatar className="w-16 h-16 mx-auto border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-audazz-blue text-white font-bold">{client.icon}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-audazz-blue transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">{client.contact}</p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" /> {client.email}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-bold">
                      <Building2 className="w-3 h-3" /> {client.revenue}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Badge variant="outline" className={`rounded-full px-4 border ${client.status === 'Ativo' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-muted-foreground'}`}>
                      {client.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
