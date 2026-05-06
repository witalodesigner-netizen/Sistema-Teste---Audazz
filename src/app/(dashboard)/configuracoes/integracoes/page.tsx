"use client"

import { motion } from "framer-motion"
import { IntegracaoCard } from "@/components/integracoes/IntegracaoCard"
import { CreditCard, MessageSquare, Zap, Globe, Share2, BarChart3 } from "lucide-react"

/**
 * Painel de Integrações - Audazz Nexus OS
 * Hub central para gerenciar conexões externas.
 */

export default function IntegracoesPage() {
  const integracoes = [
    {
      id: "asaas",
      nome: "Asaas",
      descricao: "Engine financeiro para faturas, PIX, boletos e recorrências.",
      icone: CreditCard,
      status: "conectado",
      href: "/configuracoes/integracoes/asaas",
      contador: "12 faturas este mês"
    },
    {
      id: "whatsapp",
      nome: "WhatsApp Business",
      descricao: "Notificações automáticas e atendimento integrado.",
      icone: MessageSquare,
      status: "conectado",
      href: "/configuracoes/integracoes/whatsapp",
      contador: "85 mensagens enviadas"
    },
    {
      id: "rdstation",
      nome: "RD Station",
      descricao: "Sincronização de leads e automação de marketing/CRM.",
      icone: Zap,
      status: "conectado",
      href: "/configuracoes/integracoes/rdstation",
      contador: "4 novos leads hoje"
    },
    {
      id: "google",
      nome: "Google Analytics",
      descricao: "Monitoramento de tráfego e conversão em tempo real.",
      icone: BarChart3,
      status: "em-breve",
      href: "#",
    },
    {
      id: "meta",
      nome: "Meta Ads",
      descricao: "Gestão de campanhas de tráfego pago integradas.",
      icone: Globe,
      status: "em-breve",
      href: "#",
    }
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hub de Integrações</h1>
        <p className="text-muted-foreground">Conecte o Nexus OS às suas ferramentas favoritas e automatize seu fluxo.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {integracoes.map((int, i) => (
          <IntegracaoCard key={int.id} {...int} index={i} />
        ))}
      </motion.div>
    </div>
  )
}
