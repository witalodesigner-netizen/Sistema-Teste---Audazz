"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shield, Check, X, Loader2 } from "lucide-react"

interface PermissoesFormProps {
  permissions: any
  onSave: (data: any) => Promise<void>
  isLoading?: boolean
}

export function PermissoesForm({ permissions, onSave, isLoading }: PermissoesFormProps) {
  const categories = [
    {
      title: "Aprovações & Projetos",
      items: [
        { key: "verAprovacoes", label: "Ver Aprovações", desc: "Permite visualizar entregas pendentes" },
        { key: "aprovar", label: "Aprovar Entregas", desc: "Pode aprovar ou solicitar alterações" },
        { key: "verHistoricoAprovacoes", label: "Ver Histórico", desc: "Acessar registros de versões anteriores" },
      ]
    },
    {
      title: "Materiais & Solicitações",
      items: [
        { key: "acessarMateriais", label: "Acessar Materiais", desc: "Ver guia de marca e arquivos" },
        { key: "baixarArquivos", label: "Baixar Arquivos", desc: "Download de arquivos de alta resolução" },
        { key: "fazerSolicitacoes", label: "Abrir Tickets", desc: "Criar novas solicitações de suporte" },
      ]
    },
    {
      title: "Administrativo & Financeiro",
      items: [
        { key: "verRelatorios", label: "Ver Relatórios", desc: "Acesso a relatórios de performance" },
        { key: "verFinanceiro", label: "Ver Financeiro", desc: "Visualizar faturas e orçamentos" },
        { key: "gerenciarMembros", label: "Gerenciar Equipe", desc: "Convidar e remover outros membros" },
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {categories.map((category, idx) => (
        <div key={idx} className="space-y-4">
          <h4 className="text-sm font-bold text-audazz-blue uppercase tracking-widest">{category.title}</h4>
          <div className="grid gap-4">
            {category.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-white/5 hover:border-white/10 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">{item.label}</Label>
                  <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                </div>
                <Switch 
                  defaultChecked={permissions[item.key]}
                  onCheckedChange={(val) => {}} // TODO: State management
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-6 flex justify-end gap-3">
        <Button variant="ghost" className="rounded-full">Resetar</Button>
        <Button 
          disabled={isLoading}
          className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full min-w-[140px] gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Salvar Alterações</>}
        </Button>
      </div>
    </div>
  )
}
