"use client"

import { motion } from "framer-motion"
import { Plus, MessageSquare, Tag, ChevronRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function WhatsappTemplates() {
  const templates = [
    {
      id: "1",
      nome: "Aprovação Disponível",
      categoria: "Aprovação",
      conteudo: "Olá {{nome}}! 👋 Temos uma nova entrega aguardando sua aprovação. Acesse aqui: {{link}}",
      variaveis: ["nome", "link"]
    },
    {
      id: "2",
      nome: "Lembrete de Fatura",
      categoria: "Financeiro",
      conteudo: "Oi {{nome}}! Sua fatura de R$ {{valor}} vence em 3 dias. Pague agora: {{link}}",
      variaveis: ["nome", "valor", "link"]
    },
    {
      id: "3",
      nome: "Boas-vindas Portal",
      categoria: "Acesso",
      conteudo: "Seja bem-vindo ao nosso portal, {{nome}}! Seu acesso foi liberado.",
      variaveis: ["nome"]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Templates de Mensagem</h3>
        <Button className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-xl gap-2">
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-secondary/30 rounded-[2rem] border border-white/5 p-6 backdrop-blur-xl hover:border-audazz-blue/30 transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-background/50 border border-white/5 text-audazz-blue">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">{template.nome}</h4>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {template.categoria}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-audazz-blue/10 text-muted-foreground hover:text-audazz-blue" onClick={() => {
                  navigator.clipboard.writeText(template.conteudo)
                  toast.success("Conteúdo copiado!")
                }}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-background/50 border border-white/5 text-sm italic text-muted-foreground">
                "{template.conteudo}"
              </div>

              <div className="flex flex-wrap gap-2">
                {template.variaveis.map(v => (
                  <span key={v} className="text-[10px] font-bold px-2 py-0.5 bg-secondary/50 rounded-full border border-white/5">
                    {"{{"}{v}{"}}"}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="ghost" className="text-xs font-bold gap-1 group-hover:text-audazz-blue transition-colors">
                  Editar Template <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
