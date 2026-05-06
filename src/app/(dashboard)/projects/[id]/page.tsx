"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { LayoutDashboard, ArrowLeft, Clock, CheckSquare, MessageSquare, Paperclip, MoreHorizontal, Plus, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ProjectDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/projects">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <PageHeader 
          title="Social Media Nike" 
          description={`Projeto ID: ${id} • Em Produção`}
          icon={LayoutDashboard}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none bg-secondary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-audazz-blue" /> Tarefas do Sprint
              </CardTitle>
              <Button variant="outline" size="sm" className="rounded-full text-[10px] font-bold">ADICIONAR</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { task: "Criar assets para Instagram Stories", status: "Concluído" },
                { task: "Redação das legendas para campanha", status: "Em Produção" },
                { task: "Aprovação interna de KV (Key Visual)", status: "Pendente" },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-background rounded-2xl border group hover:border-audazz-blue transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${t.status === 'Concluído' ? 'bg-audazz-blue border-audazz-blue' : 'border-muted-foreground'}`}>
                      {t.status === 'Concluído' && <CheckSquare className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${t.status === 'Concluído' ? 'line-through text-muted-foreground' : ''}`}>{t.task}</span>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px] font-black uppercase">{t.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-audazz-blue" /> Feedback e Comentários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-secondary">AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-background p-4 rounded-2xl border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Admin Audazz</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Há 2 horas</span>
                  </div>
                  <p className="text-sm text-muted-foreground">O visual do Story 01 ficou excelente! Podemos seguir com essa paleta para os demais.</p>
                </div>
              </div>
              <div className="relative pt-4">
                <Input placeholder="Escreva um comentário..." className="rounded-2xl pr-12 bg-background border-none h-12" />
                <Button size="icon" className="absolute right-1 top-5 h-10 w-10 rounded-xl bg-audazz-blue">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none bg-secondary/10">
            <CardHeader>
              <CardTitle>Progresso Geral</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Conclusão</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2 bg-background" />
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /> Deadline</span>
                  <span className="font-bold">22 Mai 2026</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground"><User2 className="w-4 h-4" /> Responsável</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-audazz-blue text-white text-[8px]">WA</AvatarFallback>
                    </Avatar>
                    <span className="font-bold">Witalo A.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Arquivos do Projeto</CardTitle>
              <Button variant="ghost" size="icon"><Paperclip className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 bg-background rounded-xl border flex items-center justify-between group cursor-pointer hover:border-audazz-blue transition-all">
                  <span className="text-[11px] font-bold truncate pr-4 text-muted-foreground">Campaign_Asset_v0{i}.png</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="w-3 h-3" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
