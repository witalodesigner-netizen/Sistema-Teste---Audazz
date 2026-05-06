"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { RefreshCw, Plus, Search, Calendar, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"

const subs = [
  { id: "SUB-101", client: "Nike Corp", plan: "Retainer Premium", value: "R$ 12.000", nextBilling: "15 Mai", status: "Ativo" },
  { id: "SUB-102", client: "Apple Inc", plan: "Social Media Pro", value: "R$ 8.500", nextBilling: "20 Mai", status: "Ativo" },
  { id: "SUB-103", client: "Coca-Cola", plan: "Growth Hacking", value: "R$ 15.000", nextBilling: "12 Mai", status: "Atrasado" },
  { id: "SUB-104", client: "Netflix", plan: "Retainer Basic", value: "R$ 5.000", nextBilling: "01 Jun", status: "Ativo" },
]

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Recorrência" 
        description="Gestão de contratos e faturamento recorrente"
        icon={RefreshCw}
        actions={
          <Button className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full gap-2">
            <Plus className="w-4 h-4" /> Novo Contrato
          </Button>
        }
      />

      <div className="grid gap-4">
        <div className="bg-audazz-blue text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10 space-y-2">
            <p className="text-audazz-blue-foreground/80 font-bold uppercase tracking-widest text-xs">MRR (Monthly Recurring Revenue)</p>
            <h2 className="text-5xl font-black tracking-tighter">R$ 40.500</h2>
            <p className="text-sm font-medium opacity-80">+15% em relação ao mês anterior</p>
          </div>
          <div className="relative z-10 flex gap-8">
            <div className="text-center">
              <p className="text-xs font-bold opacity-70 uppercase mb-1">Clientes</p>
              <p className="text-2xl font-black">24</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold opacity-70 uppercase mb-1">Churn Rate</p>
              <p className="text-2xl font-black">1.2%</p>
            </div>
          </div>
          {/* Abstract circles for decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold px-1">Assinaturas Ativas</h3>
          {subs.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/subscriptions/${sub.id}`}>
                <Card className="border-none shadow-sm hover:bg-secondary/20 transition-all cursor-pointer group">
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-audazz-blue/10 flex items-center justify-center text-audazz-blue font-bold">
                        {sub.client[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-base group-hover:text-audazz-blue transition-colors">{sub.client}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{sub.plan}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-sm font-black">{sub.value}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">/ mês</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-bold">{sub.nextBilling}</span>
                      </div>

                      <Badge className={`rounded-full px-4 border-none ${sub.status === 'Ativo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {sub.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
