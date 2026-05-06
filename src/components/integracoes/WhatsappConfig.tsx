"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { whatsappConfigSchema } from "@/lib/schemas/whatsapp"
import { saveWhatsappConfig, sendTestWhatsapp } from "@/lib/actions/whatsapp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Loader2, MessageSquare, Globe, QrCode, ShieldCheck } from "lucide-react"

export function WhatsappConfig() {
  const form = useForm({
    resolver: zodResolver(whatsappConfigSchema),
    defaultValues: {
      modalidade: "evolution",
      evolutionUrl: "",
      evolutionApiKey: "",
      evolutionInstance: "",
      metaPhoneNumberId: "",
      metaWabaId: "",
      metaAccessToken: "",
      metaWebhookToken: "nexus_whatsapp_token",
      ativo: true,
      notifAprovacao: true,
      notifFatura: true,
      notifPagamento: true
    }
  })

  async function onSubmit(data: any) {
    try {
      await saveWhatsappConfig(data)
      toast.success("Configuração do WhatsApp salva!")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  async function handleTest() {
    const phone = window.prompt("Digite seu número (com DDD):")
    if (!phone) return
    
    try {
      await sendTestWhatsapp(phone)
      toast.success("Mensagem de teste enviada!")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const modalidade = form.watch("modalidade")

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-8">
        {/* Seleção de Modalidade */}
        <div className="space-y-4">
          <Label className="text-lg font-bold">Modalidade de Conexão</Label>
          <RadioGroup 
            defaultValue="evolution" 
            onValueChange={(v) => form.setValue("modalidade", v as any)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${modalidade === "evolution" ? "bg-audazz-blue/10 border-audazz-blue shadow-lg" : "bg-background/20 border-white/5"}`}>
              <RadioGroupItem value="evolution" id="evolution" className="sr-only" />
              <Label htmlFor="evolution" className="flex items-center gap-3 cursor-pointer">
                <div className="p-2 rounded-xl bg-background/50 border border-white/5">
                  <QrCode className="w-5 h-5 text-audazz-blue" />
                </div>
                <div>
                  <p className="font-bold">Evolution API (QR Code)</p>
                  <p className="text-xs text-muted-foreground">Recomendado para multi-instâncias e self-hosted.</p>
                </div>
              </Label>
            </div>

            <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${modalidade === "meta" ? "bg-audazz-blue/10 border-audazz-blue shadow-lg" : "bg-background/20 border-white/5"}`}>
              <RadioGroupItem value="meta" id="meta" className="sr-only" />
              <Label htmlFor="meta" className="flex items-center gap-3 cursor-pointer">
                <div className="p-2 rounded-xl bg-background/50 border border-white/5">
                  <Globe className="w-5 h-5 text-audazz-blue" />
                </div>
                <div>
                  <p className="font-bold">Meta Cloud API (Oficial)</p>
                  <p className="text-xs text-muted-foreground">API oficial do Facebook com escala e estabilidade.</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Campos Dinâmicos */}
          <div className="space-y-4">
            {modalidade === "evolution" ? (
              <>
                <div className="space-y-2">
                  <Label>URL da Evolution API</Label>
                  <Input placeholder="https://api.sua-agencia.com.br" className="bg-background/50 border-white/5 rounded-xl h-12" {...form.register("evolutionUrl")} />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input type="password" placeholder="Chave de acesso global" className="bg-background/50 border-white/5 rounded-xl h-12" {...form.register("evolutionApiKey")} />
                </div>
                <div className="space-y-2">
                  <Label>Nome da Instância</Label>
                  <Input placeholder="Nexus_Agencia" className="bg-background/50 border-white/5 rounded-xl h-12" {...form.register("evolutionInstance")} />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Phone Number ID</Label>
                  <Input className="bg-background/50 border-white/5 rounded-xl h-12" {...form.register("metaPhoneNumberId")} />
                </div>
                <div className="space-y-2">
                  <Label>Permanent Access Token</Label>
                  <Input type="password" className="bg-background/50 border-white/5 rounded-xl h-12" {...form.register("metaAccessToken")} />
                </div>
              </>
            )}
          </div>

          {/* Automações */}
          <div className="bg-background/20 p-6 rounded-[2rem] border border-white/5 space-y-6">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-audazz-blue" />
              Notificações Ativas
            </h4>
            
            <div className="space-y-4">
              {[
                { label: "Links de Aprovação", key: "notifAprovacao" },
                { label: "Faturas Geradas", key: "notifFatura" },
                { label: "Pagamentos Confirmados", key: "notifPagamento" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <Label className="text-sm">{item.label}</Label>
                  <Switch 
                    checked={form.watch(item.key as any)} 
                    onCheckedChange={(v) => form.setValue(item.key as any, v)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleTest}
            className="rounded-xl border-white/5 bg-background/50 h-12 px-8 transition-all gap-2"
          >
            <MessageSquare className="w-4 h-4 text-audazz-blue" />
            Enviar Mensagem de Teste
          </Button>

          <Button 
            type="submit" 
            className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-xl h-12 px-12 transition-all gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </form>
  )
}
