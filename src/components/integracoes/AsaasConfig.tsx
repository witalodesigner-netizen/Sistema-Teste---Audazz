"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { asaasConfigSchema } from "@/lib/schemas/asaas"
import { saveAsaasConfig, testAsaasConnection } from "@/lib/actions/asaas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Zap, ShieldCheck, RefreshCw } from "lucide-react"

export function AsaasConfig() {
  const [isTesting, setIsTesting] = useState(false)
  
  const form = useForm({
    resolver: zodResolver(asaasConfigSchema),
    defaultValues: {
      apiKey: "",
      environment: "sandbox",
      webhookToken: "nexus_os_default_token",
      syncClientes: true,
      syncCobr: true,
      ativo: true
    }
  })

  async function onSubmit(data: any) {
    try {
      await saveAsaasConfig(data)
      toast.success("Configurações do Asaas salvas com sucesso!")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  async function handleTest() {
    setIsTesting(true)
    try {
      const result = await testAsaasConnection()
      if (result.success) {
        toast.success(`Conectado com sucesso! Saldo: R$ ${result.balance}`)
      } else {
        toast.error(`Falha na conexão: ${result.error}`)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-audazz-blue" />
                Asaas API Key
              </Label>
              <Input 
                type="password"
                placeholder="Introduza sua chave da API"
                className="bg-background/50 border-white/5 rounded-xl h-12"
                {...form.register("apiKey")}
              />
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Criptografado com AES-256-GCM</p>
            </div>

            <div className="space-y-2">
              <Label>Ambiente de Execução</Label>
              <Select onValueChange={(v) => form.setValue("environment", v as any)} defaultValue="sandbox">
                <SelectTrigger className="bg-background/50 border-white/5 rounded-xl h-12">
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-white/5">
                  <SelectItem value="sandbox">Sandbox (Homologação)</SelectItem>
                  <SelectItem value="production">Produção (Real)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6 bg-background/20 p-6 rounded-[2rem] border border-white/5">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-audazz-blue" />
              Sincronização Automática
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Clientes CRM</Label>
                  <p className="text-xs text-muted-foreground">Sincronizar ao criar no CRM</p>
                </div>
                <Switch 
                  checked={form.watch("syncClientes")} 
                  onCheckedChange={(v) => form.setValue("syncClientes", v)} 
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="space-y-0.5">
                  <Label className="text-sm">Faturamento Automático</Label>
                  <p className="text-xs text-muted-foreground">Criar cobrança ao emitir fatura</p>
                </div>
                <Switch 
                  checked={form.watch("syncCobr")} 
                  onCheckedChange={(v) => form.setValue("syncCobr", v)} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleTest}
            disabled={isTesting}
            className="rounded-xl border-white/5 bg-background/50 hover:bg-background/80 h-12 px-8 transition-all gap-2"
          >
            {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-yellow-500" />}
            Testar Conexão
          </Button>

          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-xl h-12 px-12 transition-all gap-2"
          >
            {form.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Salvar e Ativar Integração
          </Button>
        </div>
      </div>
    </form>
  )
}
