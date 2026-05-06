"use client"

import { motion } from "framer-motion"
import { Monitor, Smartphone, Globe, LogOut, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function SessoesAtivas() {
  const sessoes = [
    { 
      id: "1", 
      device: "Desktop", 
      os: "Windows 11 / Chrome", 
      ip: "191.185.12.102", 
      location: "São Paulo, BR", 
      current: true,
      lastActive: "Agora mesmo"
    },
    { 
      id: "2", 
      device: "Mobile", 
      os: "iPhone / Safari", 
      ip: "177.45.22.45", 
      location: "Rio de Janeiro, BR", 
      current: false,
      lastActive: "2 horas atrás"
    }
  ]

  const handleTerminate = (id: string) => {
    toast.success("Sessão encerrada com sucesso!")
  }

  return (
    <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Dispositivos Conectados</h3>
        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl text-sm font-bold">
          Sair de Todas as Sessões
        </Button>
      </div>

      <div className="space-y-4">
        {sessoes.map((sessao, i) => (
          <motion.div
            key={sessao.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-6 rounded-[2rem] bg-background/30 border border-white/5 hover:border-audazz-blue/30 transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary/50 border border-white/5 flex items-center justify-center text-audazz-blue">
                {sessao.device === "Desktop" ? <Monitor className="w-7 h-7" /> : <Smartphone className="w-7 h-7" />}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold">{sessao.os}</h4>
                  {sessao.current && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-audazz-blue/10 text-audazz-blue rounded-full border border-audazz-blue/20">
                      Esta Sessão
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground italic">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {sessao.ip}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {sessao.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {sessao.lastActive}</span>
                </div>
              </div>
            </div>

            {!sessao.current && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleTerminate(sessao.id)}
                className="rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
