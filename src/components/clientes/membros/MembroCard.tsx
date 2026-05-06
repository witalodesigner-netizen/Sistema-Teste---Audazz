"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, Mail, Phone, Trash2, Settings2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

interface MembroCardProps {
  member: {
    id: string
    name: string
    email: string
    role: string
    jobTitle: string | null
    avatarUrl: string | null
    status: string
  }
  onEditPermissions: (id: string) => void
  onDelete: (id: string) => void
}

export function MembroCard({ member, onEditPermissions, onDelete }: MembroCardProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "DONO": return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 rounded-full">Dono</Badge>
      case "GESTOR": return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 rounded-full">Gestor</Badge>
      default: return <Badge className="bg-slate-500/10 text-slate-500 border-slate-500/20 rounded-full">Visualizador</Badge>
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-secondary/10 backdrop-blur-sm group overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-audazz-blue opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 border-2 border-background shadow-md">
                <AvatarImage src={member.avatarUrl || ""} />
                <AvatarFallback className="bg-audazz-blue text-white font-bold">
                  {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-lg leading-tight">{member.name}</h4>
                  {getRoleBadge(member.role)}
                </div>
                <p className="text-sm text-muted-foreground font-medium">{member.jobTitle || "Membro"}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DropdownMenuItem onClick={() => onEditPermissions(member.id)} className="gap-2 focus:bg-audazz-blue/10 focus:text-audazz-blue">
                  <Shield className="w-4 h-4" /> Ajustar Permissões
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 focus:bg-audazz-blue/10 focus:text-audazz-blue">
                  <Settings2 className="w-4 h-4" /> Editar Dados
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(member.id)} className="gap-2 text-red-500 focus:bg-red-500/10 focus:text-red-500">
                  <Trash2 className="w-4 h-4" /> Remover Acesso
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" /> {member.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className={`h-2 w-2 rounded-full p-0 border-none ${member.status === 'ativo' ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span className="capitalize">{member.status}</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="rounded-full text-xs font-bold border-white/10 hover:bg-white/5">
              Ver Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
