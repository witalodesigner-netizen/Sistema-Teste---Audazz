"use client"

import { motion } from "framer-motion"
import { IntegracaoCard } from "@/components/integracoes/IntegracaoCard"
import { CreditCard, MessageSquare, Zap, Globe, Share2, BarChart3, ChevronLeft } from "lucide-react"
import Link from "next/link"

/**
 * Painel de Integrações - Audazz Nexus OS
 * Hub central para gerenciar conexões externas.
 */

export default function IntegrationsPage() {
  const integracoes = [
    {
      id: "asaas",
      nome: "Asaas",
      descricao: "Engine financeiro para faturas, PIX, boletos e recorrências.",
      icone: CreditCard,
      status: "conectado",
      href: "/settings/integrations/asaas",
      contador: "Integração Ativa"
    },
    {
      id: "whatsapp",
      nome: "WhatsApp Business",
      descricao: "Notificações automáticas de briefings e alertas financeiros.",
      icone: MessageSquare,
      status: "conectado",
      href: "/settings/integrations/whatsapp",
      contador: "Online"
    },
    {
      id: "rdstation",
      nome: "RD Station",
      descricao: "Sincronização de leads e automação de marketing/CRM.",
      icone: Zap,
      status: "conectado",
      href: "/settings/integrations/rdstation",
      contador: "Sincronizado"
    },
    {
      id: "slack",
      nome: "Slack",
      descricao: "Sincronização de tarefas e conversas em tempo real.",
      icone: Share2,
      status: "em-breve",
      href: "#",
    },
    {
      id: "google-drive",
      nome: "Google Drive",
      descricao: "Armazenamento centralizado de arquivos e assets.",
      icone: BarChart3, // Using BarChart3 as a placeholder since original had Globe/Drive
      status: "em-breve",
      href: "#",
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight">Integrações</h1>
        <p className="text-muted-foreground">Conecte suas ferramentas favoritas ao Nexus OS para máxima automação.</p>
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

