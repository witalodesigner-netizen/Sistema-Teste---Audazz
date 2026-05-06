"use client"

import { Repeat, Calendar, CreditCard, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AsaasSubscription() {
  return (
    <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-audazz-blue/10 border border-audazz-blue/20 text-audazz-blue">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Assinatura Recorrente</h3>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">Plano: Gestão Mensal</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full border bg-green-500/10 text-green-500 border-green-500/20">Ativa</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-[2rem] bg-background/30 border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-audazz-blue">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Próximo Pagamento</span>
          </div>
          <div>
            <p className="text-2xl font-bold">15 de Junho</p>
            <p className="text-xs text-muted-foreground">Débito automático no cartão final 4432</p>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] bg-background/30 border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-audazz-blue">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Valor Mensal</span>
          </div>
          <div>
            <p className="text-2xl font-bold">R$ 3.500,00</p>
            <p className="text-xs text-muted-foreground">Incluso taxa de gestão e suporte 24h</p>
          </div>
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-orange-500 leading-relaxed font-medium">
          Alterações no plano ou cancelamento devem ser feitos com no mínimo 7 dias de antecedência ao próximo vencimento.
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" className="text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl">Cancelar Assinatura</Button>
        <Button className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-xl px-8 font-bold gap-2">
          Gerenciar Plano
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
