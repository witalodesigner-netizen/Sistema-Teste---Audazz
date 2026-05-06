"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { Zap, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

const team = [
  { name: "Witalo", role: "Design Lead", taskCount: 8, completion: 85, avatar: "W" },
  { name: "Ana Silva", role: "Motion Designer", taskCount: 12, completion: 60, avatar: "A" },
  { name: "Lucas Rocha", role: "Copywriter", taskCount: 5, completion: 100, avatar: "L" },
  { name: "Carla Souza", role: "Dev Frontend", taskCount: 10, completion: 45, avatar: "C" },
]

export default function ProductivityPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Produtividade" 
        description="Monitoramento de entregas e eficiência da equipe"
        icon={Zap}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Tarefas Concluídas", value: "128", icon: CheckCircle2, color: "text-green-500" },
          { label: "Em Atraso", value: "12", icon: AlertCircle, color: "text-red-500" },
          { label: "Tempo Médio", value: "4.2 dias", icon: Clock, color: "text-audazz-blue" },
          { label: "Eficiência", value: "94%", icon: Zap, color: "text-purple-500" },
        ].map((stat, i) => (
          <Card key={stat.label} className="border-none bg-secondary/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-background border ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</p>
                <h4 className="text-2xl font-black">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold px-1">Performance da Equipe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none bg-secondary/10 hover:bg-secondary/20 transition-all cursor-pointer">
                <CardContent className="p-6 flex items-center gap-6">
                  <Avatar className="w-12 h-12 border-2 border-background">
                    <AvatarFallback className="bg-audazz-blue text-white font-bold">{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-base">{member.name}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{member.role}</p>
                      </div>
                      <span className="text-xs font-black text-audazz-blue">{member.completion}%</span>
                    </div>
                    <Progress value={member.completion} className="h-1.5 bg-background" />
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span>{member.taskCount} Tarefas Ativas</span>
                      <span>Meta: 100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
