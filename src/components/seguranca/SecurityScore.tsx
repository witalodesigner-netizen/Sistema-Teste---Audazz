"use client"

import { motion } from "framer-motion"
import { ShieldCheck, CheckCircle2, AlertTriangle, Circle } from "lucide-react"

export function SecurityScore() {
  const score = 87
  const recommendations = [
    { label: "MFA Ativo", active: true },
    { label: "Criptografia de Dados", active: true },
    { label: "Auditoria Estruturada", active: true },
    { label: "Políticas de Acesso (RBAC)", active: true },
    { label: "Monitoramento de Sessões", active: false },
  ]

  return (
    <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={364.4}
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: 364.4 - (364.4 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-audazz-blue"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Score</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-lg">Excelente Postura</h3>
          <p className="text-xs text-muted-foreground italic">Sua agência está 87% protegida.</p>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-white/5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Checklist de Segurança</h4>
        {recommendations.map((rec) => (
          <div key={rec.label} className="flex items-center justify-between">
            <span className="text-sm font-medium">{rec.label}</span>
            {rec.active ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
