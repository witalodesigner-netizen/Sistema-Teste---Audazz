"use client"

import { motion } from "framer-motion"
import { Wallet, TrendingUp, AlertCircle, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AsaasDashboard() {
  const stats = [
    { label: "Saldo Disponível", value: "R$ 12.450,00", icon: Wallet, color: "text-audazz-blue" },
    { label: "Receita (Mês)", value: "R$ 45.890,00", icon: TrendingUp, color: "text-green-500" },
    { label: "A Receber", value: "R$ 8.200,00", icon: Clock, color: "text-orange-500" },
    { label: "Inadimplência", value: "2.5%", icon: AlertCircle, color: "text-red-500" },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-secondary/30 rounded-[2rem] border border-white/5 p-6 backdrop-blur-xl space-y-4"
          >
            <div className="p-2 w-fit rounded-xl bg-background/50 border border-white/5">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Próximos Vencimentos */}
        <div className="lg:col-span-2 bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Próximos Vencimentos</h3>
            <Button variant="ghost" className="text-audazz-blue hover:text-audazz-blue/80 gap-1 font-bold text-sm">
              Ver Todas <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-background/30 border border-white/5 hover:bg-background/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-audazz-blue/10 flex items-center justify-center font-bold text-audazz-blue">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold">John Doe Design</h4>
                    <p className="text-xs text-muted-foreground italic">Vence em {i + 2} dias</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ 2.500,00</p>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-full">Pendente</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-6">
          <h3 className="text-xl font-bold">Webhooks Recentes</h3>
          <div className="space-y-6">
            {[
              { type: "Pagamento Recebido", time: "15 min atrás", success: true },
              { type: "Boleto Gerado", time: "2 horas atrás", success: true },
              { type: "Vencimento Alerta", time: "5 horas atrás", success: true },
              { type: "Sync Cliente", time: "Ontem", success: true },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-1 p-1 rounded-full ${log.success ? "bg-green-500/20" : "bg-red-500/20"}`}>
                  <CheckCircle2 className={`w-3 h-3 ${log.success ? "text-green-500" : "text-red-500"}`} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">{log.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
