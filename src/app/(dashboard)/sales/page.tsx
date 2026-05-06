"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { TrendingUp, Target, Users, PhoneCall, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

const funnelStages = [
  { stage: "Leads", count: 120, value: "R$ 450k", color: "bg-audazz-blue", icon: Users },
  { stage: "Qualificação", count: 45, value: "R$ 180k", color: "bg-purple-500", icon: Target },
  { stage: "Proposta", count: 12, value: "R$ 65k", color: "bg-orange-500", icon: PhoneCall },
  { stage: "Fechamento", count: 5, value: "R$ 22k", color: "bg-green-500", icon: CheckCircle2 },
]

export default function SalesPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Funil de Vendas" 
        description="Acompanhamento de conversão e pipeline"
        icon={TrendingUp}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {funnelStages.map((stage, i) => (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm bg-secondary/10 overflow-hidden relative group">
              <div className={`absolute top-0 left-0 w-1 h-full ${stage.color}`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stage.stage}</p>
                  <stage.icon className={`w-4 h-4 ${stage.color.replace('bg-', 'text-')}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <h3 className="text-3xl font-black tracking-tighter">{stage.count}</h3>
                <p className="text-sm font-bold text-muted-foreground">{stage.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold px-1">Visualização do Pipeline</h2>
        <div className="flex flex-col gap-2">
          {funnelStages.map((stage, i) => (
            <motion.div
              key={stage.stage + "-bar"}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="relative h-12 rounded-xl bg-secondary/20 overflow-hidden flex items-center group cursor-pointer"
            >
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${100 - (i * 20)}%` }}
                transition={{ delay: i * 0.2 + 0.5, duration: 1 }}
                className={`h-full ${stage.color} opacity-20`}
              />
              <div className="absolute inset-0 px-6 flex items-center justify-between">
                <span className="font-bold text-sm">{stage.stage}</span>
                <span className="font-black text-sm">{100 - (i * 20)}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
