"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { rdStationConfigSchema } from "@/lib/schemas/rdstation"
import { saveRdStationConfig } from "@/lib/actions/rdstation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Zap, RefreshCw, Unlink, Lock } from "lucide-react"

export function RdStationConfig() {
  const form = useForm({
    resolver: zodResolver(rdStationConfigSchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
      tipo: "ambos",
      syncContatos: true,
      syncFunil: true,
      ativo: false
    }
  })

  async function onSubmit(data: any) {
    try {
      await saveRdStationConfig(data)
      toast.success("Integração RD Station configurada!")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const isConnected = form.watch("ativo")

  return (
    <div className="space-y-8">
      {!isConnected ? (
        <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-12 backdrop-blur-xl flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-[2rem] bg-orange-500/10 border border-orange-500/20">
            <Zap className="w-12 h-12 text-orange-500" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-2xl font-bold">Conectar RD Station</h3>
            <p className="text-muted-foreground">Sincronize seus leads e oportunidades automaticamente entre o CRM do Nexus OS e o RD Station.</p>
          </div>
          
          <div className="w-full max-w-sm space-y-4 pt-4">
            <div className="space-y-2 text-left">
              <Label>Client ID</Label>
              <Input className="bg-background/50 border-white/5 rounded-xl h-12" {...form.register("clientId")} />
            </div>
            <div className="space-y-2 text-left">
              <Label>Client Secret</Label>
              <Input type="password" className="bg-background/50 border-white/5 rounded-xl h-12" {...form.register("clientSecret")} />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 h-12 rounded-xl gap-2 font-bold transition-all shadow-lg shadow-orange-500/20" onClick={form.handleSubmit(onSubmit)}>
              Conectar com RD Station
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Conta Conectada</h3>
                    <p className="text-sm text-muted-foreground">Agência Digital Audazz (OAuth Ativo)</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl gap-2">
                  <Unlink className="w-4 h-4" />
                  Desconectar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label>Tipo de Sincronização</Label>
                  <Select defaultValue="ambos">
                    <SelectTrigger className="bg-background/50 border-white/5 rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-white/5">
                      <SelectItem value="marketing">RD Station Marketing</SelectItem>
                      <SelectItem value="crm">RD Station CRM</SelectItem>
                      <SelectItem value="ambos">Ambos (Marketing & CRM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4 bg-background/20 p-6 rounded-[2rem] border border-white/5">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Automações Ativas</h4>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Sync de Contatos</Label>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <Label className="text-sm">Sync de Funil</Label>
                    <Switch checked />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-6">
            <h3 className="font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-orange-500" />
              Sincronização Manual
            </h3>
            <p className="text-xs text-muted-foreground">Forçar atualização de todos os clientes e leads entre as plataformas.</p>
            <Button className="w-full bg-background/50 hover:bg-background/80 border-white/5 rounded-xl h-12 gap-2 text-sm font-bold">
              Sincronizar Agora
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ChevronRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  )
}
