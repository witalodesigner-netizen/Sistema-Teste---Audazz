"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, FileText, LayoutDashboard, Zap, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Aprovações Pendentes", value: "03", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Projetos em Andamento", value: "05", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Materiais Enviados", value: "12", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Tickets Abertos", value: "01", icon: CheckSquare, color: "text-green-500", bg: "bg-green-500/10" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function PortalDashboard() {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Painel do Cliente</h1>
        <p className="text-muted-foreground font-medium">Acompanhe o progresso de seus projetos e aprovacões.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="border-none shadow-sm bg-secondary/10 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 rounded-3xl overflow-hidden group">
               <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                 </div>
                 <div className="space-y-1">
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                   <p className="text-3xl font-black">{stat.value}</p>
                 </div>
               </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Atividades Recentes */}
        <Card className="lg:col-span-2 border-none bg-secondary/10 rounded-[2.5rem] p-8">
           <CardHeader className="px-0 pt-0 pb-6 border-b border-white/5 mb-6">
              <CardTitle className="text-xl">Últimas Atualizações</CardTitle>
           </CardHeader>
           <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-audazz-blue/10 flex items-center justify-center text-audazz-blue shrink-0">
                      <Zap className="w-5 h-5" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-bold">Nova entrega para aprovação: <span className="text-audazz-blue">Social Media Pack v2</span></p>
                      <p className="text-xs text-muted-foreground font-medium">Há 2 horas • Marketing Digital</p>
                   </div>
                </div>
              ))}
           </div>
        </Card>

        {/* Quick Help */}
        <Card className="border-none bg-audazz-blue rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
           <Zap className="absolute -right-8 -top-8 w-40 h-40 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
           <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-bold leading-tight">Precisa de suporte rápido?</h3>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                Nossa equipe está pronta para ajudar. Abra um ticket de solicitação ou fale direto no WhatsApp.
              </p>
              <div className="flex flex-col gap-3">
                 <Button className="bg-white text-audazz-blue hover:bg-white/90 rounded-full font-bold">Abrir Solicitação</Button>
                 <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full font-bold">Ver Base de Conhecimento</Button>
              </div>
           </div>
        </Card>
      </div>
    </div>
  )
}
