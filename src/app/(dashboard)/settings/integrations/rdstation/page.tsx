"use client"

import { RdStationConfig } from "@/components/integracoes/RdStationConfig"
import { RdStationFunil } from "@/components/integracoes/RdStationFunil"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function RdStationConfigPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Link href="/settings/integrations" className="text-sm text-muted-foreground hover:text-audazz-blue flex items-center gap-1 mb-2 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Voltar para Integrações
        </Link>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          Integração RD Station
          <span className="text-xs font-bold uppercase px-2 py-1 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20">
            Marketing & CRM
          </span>
        </h1>
        <p className="text-muted-foreground">Sincronize seus leads e oportunidades entre o Nexus OS e o RD Station.</p>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="bg-secondary/30 p-1 rounded-2xl border border-white/5 backdrop-blur-xl h-14 w-fit">
          <TabsTrigger value="config" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Conexão OAuth
          </TabsTrigger>
          <TabsTrigger value="mapeamento" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Mapeamento de Funil
          </TabsTrigger>
          <TabsTrigger value="logs" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Leads Capturados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-0">
          <RdStationConfig />
        </TabsContent>

        <TabsContent value="mapeamento" className="mt-0">
          <RdStationFunil />
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl">
            <p className="text-muted-foreground">Aguardando primeira conversão do RD Station...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
