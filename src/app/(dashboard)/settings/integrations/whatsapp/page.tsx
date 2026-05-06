"use client"

import { WhatsappConfig } from "@/components/integracoes/WhatsappConfig"
import { WhatsappTemplates } from "@/components/integracoes/WhatsappTemplates"
import { WhatsappLog } from "@/components/integracoes/WhatsappLog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function WhatsappConfigPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Link href="/settings/integrations" className="text-sm text-muted-foreground hover:text-audazz-blue flex items-center gap-1 mb-2 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Voltar para Integrações
        </Link>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          Integração WhatsApp
          <span className="text-xs font-bold uppercase px-2 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
            Comunicação
          </span>
        </h1>
        <p className="text-muted-foreground">Gerencie o envio de notificações automáticas via WhatsApp Business API.</p>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="bg-secondary/30 p-1 rounded-2xl border border-white/5 backdrop-blur-xl h-14 w-fit">
          <TabsTrigger value="config" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Conexão
          </TabsTrigger>
          <TabsTrigger value="templates" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Templates
          </TabsTrigger>
          <TabsTrigger value="logs" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-0">
          <WhatsappConfig />
        </TabsContent>

        <TabsContent value="templates" className="mt-0">
          <WhatsappTemplates />
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <WhatsappLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}
