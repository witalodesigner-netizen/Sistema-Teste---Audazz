"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { portalConfigSchema, PortalConfigValues } from "@/lib/schemas/client-portal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { usePortal } from "@/hooks/use-portal"
import { Globe, Palette, Layout, Save, Loader2, Link2 } from "lucide-react"

interface PortalConfigProps {
  clientId: string
  initialConfig?: any
}

export function PortalConfig({ clientId, initialConfig }: PortalConfigProps) {
  const { isLoading, handleUpdateConfig } = usePortal(clientId)
  
  const form = useForm<PortalConfigValues>({
    resolver: zodResolver(portalConfigSchema) as any,
    defaultValues: {
      ativo: Boolean(initialConfig?.ativo),
      slug: String(initialConfig?.slug || ""),
      logoUrl: String(initialConfig?.logoUrl || ""),
      corDestaque: String(initialConfig?.corDestaque || "#0071E3"),
      mensagemBoasVindas: String(initialConfig?.mensagemBoasVindas || ""),
      mostrarAprovacoes: initialConfig?.mostrarAprovacoes !== false,
      mostrarMateriais: initialConfig?.mostrarMateriais !== false,
      mostrarRelatorios: initialConfig?.mostrarRelatorios !== false,
      mostrarSolicitacoes: initialConfig?.mostrarSolicitacoes !== false,
      mostrarFinanceiro: Boolean(initialConfig?.mostrarFinanceiro),
      webhookUrl: String(initialConfig?.webhookUrl || ""),
    }
  })

  const onSubmit = async (data: PortalConfigValues) => {
    await handleUpdateConfig(data)
  }

  return (
    <div className="bg-secondary/10 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Configurações de Acesso */}
        <Card className="border-none bg-secondary/10 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-audazz-blue" />
              Acesso e Link
            </CardTitle>
            <CardDescription>Defina como o cliente acessará o portal.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-audazz-blue/5 rounded-2xl border border-audazz-blue/10">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Portal Ativo</Label>
                <p className="text-xs text-muted-foreground">Ativar/Desativar acesso do cliente</p>
              </div>
              <Switch 
                checked={form.watch("ativo")}
                onCheckedChange={(val) => form.setValue("ativo", val)}
              />
            </div>

            <div className="space-y-2">
              <Label>Slug Personalizado</Label>
              <div className="flex items-center gap-2 bg-secondary/30 rounded-xl px-3 py-1">
                <span className="text-sm text-muted-foreground font-mono">audazz.com/portal/</span>
                <Input 
                  {...form.register("slug")}
                  className="bg-transparent border-none p-0 h-8 focus-visible:ring-0 font-bold"
                  placeholder="nome-do-cliente"
                />
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Link2 className="w-3 h-3" /> Este será o link de acesso exclusivo do cliente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Visual e Identidade */}
        <Card className="border-none bg-secondary/10 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-white/5">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-audazz-blue" />
              Identidade Visual
            </CardTitle>
            <CardDescription>Personalize a aparência do portal.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cor de Destaque</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    {...form.register("corDestaque")}
                    className="w-12 h-10 p-1 rounded-lg bg-secondary/30 border-none cursor-pointer"
                  />
                  <Input 
                    {...form.register("corDestaque")}
                    className="bg-secondary/30 border-none rounded-xl font-mono uppercase"
                    placeholder="#2563EB"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mensagem de Boas-Vindas</Label>
              <Textarea 
                {...form.register("mensagemBoasVindas")}
                placeholder="Ex: Bem-vindo ao seu ecossistema de alta performance!"
                className="bg-secondary/30 border-none rounded-2xl min-h-[100px] resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visibilidade de Módulos */}
      <Card className="border-none bg-secondary/10 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-secondary/20 border-b border-white/5">
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-audazz-blue" />
            Módulos Ativos
          </CardTitle>
          <CardDescription>Escolha quais seções o cliente poderá visualizar.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: "mostrarAprovacoes", label: "Aprovações" },
              { key: "mostrarMateriais", label: "Materiais" },
              { key: "mostrarRelatorios", label: "Relatórios" },
              { key: "mostrarSolicitacoes", label: "Solicitações" },
            ].map((mod) => (
              <div key={mod.key} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-white/5">
                <Label className="font-bold">{mod.label}</Label>
                <Switch 
                  checked={form.watch(mod.key as any)}
                  onCheckedChange={(val) => form.setValue(mod.key as any, val)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full h-12 px-10 gap-2 font-bold shadow-lg shadow-audazz-blue/20 transition-all hover:scale-105"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar Configurações</>}
        </Button>
      </div>
      </form>
    </div>
  )
}
