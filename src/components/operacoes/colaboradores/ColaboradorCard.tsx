"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Briefcase, MapPin, MoreVertical, Calendar, Zap } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import Link from "next/link"

interface ColaboradorCardProps {
  collaborator: {
    id: string
    nome: string
    cargo: string
    departamento: string
    vinculo: string
    emailProfissional: string
    avatarUrl: string | null
    cidade: string | null
    estado: string | null
    ativo: boolean
    podeSerAlocado: boolean
  }
}

export function ColaboradorCard({ collaborator }: ColaboradorCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-secondary/10 backdrop-blur-sm group rounded-[2rem] overflow-hidden relative">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-audazz-blue/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
        
        <CardContent className="p-8">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-5 text-center sm:text-left">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-background shadow-xl ring-2 ring-audazz-blue/10">
                  <AvatarImage src={collaborator.avatarUrl || ""} />
                  <AvatarFallback className="bg-audazz-blue text-white text-xl font-bold">
                    {collaborator.nome.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-background ${collaborator.ativo ? 'bg-green-500' : 'bg-red-500'}`} title={collaborator.ativo ? "Ativo" : "Inativo"} />
              </div>

              <div className="space-y-2">
                <div className="space-y-0.5">
                  <h4 className="text-xl font-bold tracking-tight group-hover:text-audazz-blue transition-colors">{collaborator.nome}</h4>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <span className="text-sm font-bold text-muted-foreground">{collaborator.cargo}</span>
                    <span className="text-muted-foreground/30">•</span>
                    <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 font-bold text-[10px] uppercase tracking-widest px-3">
                      {collaborator.departamento}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-white/10 shadow-2xl">
                <DropdownMenuItem className="gap-2 font-bold"><Calendar className="w-4 h-4" /> Registrar Ausência</DropdownMenuItem>
                <DropdownMenuItem className="gap-2 font-bold"><Zap className="w-4 h-4" /> Alocar Projeto</DropdownMenuItem>
                <DropdownMenuItem className="gap-2 font-bold text-red-500"><MoreVertical className="w-4 h-4" /> Desativar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-muted-foreground relative z-10">
            <div className="flex items-center gap-2 bg-background/40 p-3 rounded-2xl border border-white/5">
              <Mail className="w-4 h-4 text-audazz-blue" />
              <span className="truncate">{collaborator.emailProfissional}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/40 p-3 rounded-2xl border border-white/5">
              <Briefcase className="w-4 h-4 text-audazz-blue" />
              <span>{collaborator.vinculo}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              {collaborator.cidade ? `${collaborator.cidade}, ${collaborator.estado}` : "Remoto"}
            </div>
            
            <Link href={`/operacoes/colaboradores/${collaborator.id}`}>
              <Button size="sm" className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full font-bold px-6 h-10 group/btn">
                Ver Perfil
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </motion.span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ArrowUpRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}
