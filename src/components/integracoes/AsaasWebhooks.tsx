"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, ShieldCheck, Globe, Info, Loader2, Save, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { testAsaasWebhook, saveAsaasWebhook, getAsaasWebhookToken } from "@/lib/actions/asaas-webhooks"

export function AsaasWebhooks() {
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  // URL gerada para o webhook
  const webhookUrl = "https://nexus.audazz.com/api/webhooks/asaas"

  useEffect(() => {
    const loadToken = async () => {
      const result = await getAsaasWebhookToken()
      if (result.success) setToken(result.token)
      setLoading(false)
    }
    loadToken()
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    toast.success("URL copiada para a área de transferência!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!token) {
      toast.error("Por favor, insira um token.")
      return
    }
    setSaving(true)
    const result = await saveAsaasWebhook(token)
    if (result.success) {
      toast.success("Token de Webhook salvo no sistema!")
    } else {
      toast.error("Erro ao salvar o token.")
    }
    setSaving(false)
  }

  const handleTest = async () => {
    if (!token) {
      toast.error("Insira o token para realizar o teste.")
      return
    }

    setTesting(true)
    try {
      const result = await testAsaasWebhook(token)
      if (result.success) {
        toast.success("Conexão bem-sucedida! O sistema validou o token dinamicamente.")
      } else {
        toast.error(`Falha no teste: ${result.error}`)
      }
    } catch (e) {
      toast.error("Erro ao processar o teste de conexão.")
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-audazz-blue" />
        <p className="text-muted-foreground animate-pulse">Carregando configurações...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      {/* Header Informativo */}
      <div className="bg-audazz-blue/10 border border-audazz-blue/20 rounded-[2rem] p-8 backdrop-blur-xl flex gap-6 items-start">
        <div className="w-12 h-12 rounded-2xl bg-audazz-blue flex items-center justify-center shrink-0 shadow-lg shadow-audazz-blue/20">
          <Info className="text-white w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Conecte seu sistema ao Asaas</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Para que o Audazz Nexus receba confirmações de pagamento e atualize o financeiro automaticamente, 
            você deve configurar o Webhook no seu painel do Asaas usando os dados abaixo.
          </p>
        </div>
      </div>

      <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-10 backdrop-blur-xl space-y-12">
        
        {/* Passo 1: URL */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary border border-white/10 flex items-center justify-center text-xs font-black">1</div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">URL de Conexão</h4>
          </div>
          
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Copie esta URL e cole no painel do Asaas</Label>
            <div className="relative group">
              <Input 
                readOnly 
                value={webhookUrl}
                className="bg-background/50 border-white/10 rounded-2xl h-14 pl-12 pr-32 font-mono text-sm text-audazz-blue"
              />
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Button 
                onClick={copyToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-audazz-blue hover:bg-audazz-blue/90 rounded-xl h-10 px-4 gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado" : "Copiar URL"}
              </Button>
            </div>
          </div>
        </div>

        {/* Passo 2: Token */}
        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary border border-white/10 flex items-center justify-center text-xs font-black">2</div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Token de Autenticação</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-muted-foreground ml-1">Insira o Token definido no Asaas</Label>
              <div className="relative">
                <Input 
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Seu token de segurança do webhook"
                  className="bg-background/50 border-white/10 rounded-2xl h-14 pl-12 pr-4"
                />
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleTest}
                disabled={testing || saving}
                variant="outline"
                className="border-audazz-blue text-audazz-blue hover:bg-audazz-blue/5 rounded-2xl h-14 px-8 font-bold gap-3 flex-1"
              >
                {testing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Testar Conexão
              </Button>

              <Button 
                onClick={handleSave}
                disabled={saving || testing}
                className="bg-emerald-800 hover:bg-emerald-900 rounded-2xl h-14 px-10 font-bold gap-3 shadow-lg shadow-emerald-900/20 flex-1"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Salvar
              </Button>
            </div>
          </div>
          
          <p className="text-[11px] text-muted-foreground italic flex items-center gap-2 bg-background/20 p-4 rounded-2xl border border-white/5">
            <Info className="w-4 h-4 text-audazz-blue" />
            Este token é essencial para que o sistema valide que as notificações realmente vieram do Asaas.
          </p>
        </div>

      </div>

      {/* Footer Visual */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground opacity-50">
          <ShieldCheck className="w-4 h-4" />
          Conexão Segura e Criptografada
        </div>
      </div>
    </motion.div>
  )
}
