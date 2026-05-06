"use client"

import { AsaasConfig } from "@/components/integracoes/AsaasConfig"
import { AsaasDashboard } from "@/components/integracoes/AsaasDashboard"
import { AsaasWebhooks } from "@/components/integracoes/AsaasWebhooks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AsaasConfigPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/settings/integrations" className="text-sm text-muted-foreground hover:text-audazz-blue flex items-center gap-1 mb-2 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Voltar para Integrações
          </Link>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Integração Asaas
            <span className="text-xs font-bold uppercase px-2 py-1 bg-audazz-blue/10 text-audazz-blue rounded-full border border-audazz-blue/20">
              Financeiro
            </span>
          </h1>
          <p className="text-muted-foreground">Configure sua conta Asaas e automatize faturas, boletos e PIX.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-white/5 bg-secondary/30 backdrop-blur-xl">
            Documentação API
          </Button>
          <Button className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-xl">
            Ajuda e Suporte
          </Button>
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="bg-secondary/30 p-1 rounded-2xl border border-white/5 backdrop-blur-xl h-14">
          <TabsTrigger value="dashboard" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="config" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Configurações
          </TabsTrigger>
          <TabsTrigger value="logs" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Logs de API
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all">
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-0">
          <AsaasDashboard />
        </TabsContent>

        <TabsContent value="config" className="mt-0">
          <AsaasConfig />
        </TabsContent>

        <TabsContent value="webhooks" className="mt-0">
          <AsaasWebhooks />
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl">
            <p className="text-muted-foreground">Nenhum log de API nas últimas 24 horas.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
