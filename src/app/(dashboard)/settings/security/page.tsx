"use client"

import { SecurityScore } from "@/components/seguranca/SecurityScore"
import { SessoesAtivas } from "@/components/seguranca/SessoesAtivas"
import { MfaSetup } from "@/components/seguranca/MfaSetup"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, History, Lock, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SegurancaPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Segurança e Auditoria
            <ShieldCheck className="w-8 h-8 text-audazz-blue" />
          </h1>
          <p className="text-muted-foreground">Proteja seus dados, gerencie acessos e monitore atividades suspeitas.</p>
        </div>
        
        <Link href="/settings/security/auditoria">
          <Button variant="outline" className="rounded-xl border-white/5 bg-secondary/30 backdrop-blur-xl gap-2">
            <History className="w-4 h-4" />
            Ver Auditoria Completa
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="sessions" className="space-y-6">
            <TabsList className="bg-secondary/30 p-1 rounded-2xl border border-white/5 backdrop-blur-xl h-14">
              <TabsTrigger value="sessions" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all gap-2">
                <Eye className="w-4 h-4" />
                Sessões Ativas
              </TabsTrigger>
              <TabsTrigger value="mfa" className="px-8 rounded-xl data-[state=active]:bg-audazz-blue data-[state=active]:text-white h-full transition-all gap-2">
                <Lock className="w-4 h-4" />
                Verificação MFA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="mt-0">
              <SessoesAtivas />
            </TabsContent>

            <TabsContent value="mfa" className="mt-0">
              <MfaSetup />
            </TabsContent>
          </Tabs>
        </div>

        {/* Barra Lateral de Status */}
        <div className="space-y-8">
          <SecurityScore />
          
          <div className="bg-secondary/30 rounded-[2rem] border border-white/5 p-6 backdrop-blur-xl space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-audazz-blue" />
              Criptografia Ativa
            </h3>
            <div className="space-y-3">
              {[
                "Campos Financeiros (AES-256)",
                "API Keys (Criptografadas)",
                "Logs de Auditoria (Imutáveis)",
                "Documentos (Protegidos)"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
