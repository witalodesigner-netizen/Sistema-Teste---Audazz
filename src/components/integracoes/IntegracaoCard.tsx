"use client"

import { motion } from "framer-motion"
import { LucideIcon, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface IntegracaoCardProps {
  id: string
  nome: string
  descricao: string
  icone: LucideIcon
  status: "conectado" | "desconectado" | "em-breve" | string
  href: string
  contador?: string
  index: number
}

export function IntegracaoCard({ nome, descricao, icone: Icon, status, href, contador, index }: IntegracaoCardProps) {
  const isEmBreve = status === "em-breve"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!isEmBreve ? { y: -5 } : {}}
      className={cn(
        "group relative p-6 rounded-[2rem] border transition-all duration-500",
        isEmBreve 
          ? "bg-secondary/10 border-white/5 opacity-60 cursor-not-allowed" 
          : "bg-secondary/30 border-white/5 hover:border-audazz-blue/50 backdrop-blur-xl shadow-2xl"
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={cn(
            "p-3 rounded-2xl bg-secondary/50 border border-white/5 transition-colors",
            !isEmBreve && "group-hover:bg-audazz-blue/10 group-hover:border-audazz-blue/20"
          )}>
            <Icon className={cn("w-6 h-6", !isEmBreve ? "text-audazz-blue" : "text-muted-foreground")} />
          </div>
          
          <div className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
            status === "conectado" ? "bg-green-500/10 text-green-500 border-green-500/20" :
            status === "desconectado" ? "bg-red-500/10 text-red-500 border-red-500/20" :
            "bg-muted/50 text-muted-foreground border-white/5"
          )}>
            {status.replace("-", " ")}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-lg">{nome}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {descricao}
          </p>
        </div>

        {contador && !isEmBreve && (
          <div className="pt-2">
            <span className="text-xs font-medium text-audazz-blue bg-audazz-blue/5 px-3 py-1 rounded-full border border-audazz-blue/10">
              {contador}
            </span>
          </div>
        )}

        <div className="pt-4 flex items-center justify-between">
          {!isEmBreve ? (
            <Link href={href} className="flex items-center gap-2 text-sm font-bold text-audazz-blue group-hover:gap-3 transition-all">
              Configurar Integração
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground font-medium italic">Disponível em breve</span>
          )}
        </div>
      </div>

      {/* Glow Effect on Hover */}
      {!isEmBreve && (
        <div className="absolute inset-0 rounded-[2rem] bg-audazz-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
      )}
    </motion.div>
  )
}
