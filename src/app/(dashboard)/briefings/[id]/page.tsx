"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { Briefcase, ArrowLeft, Calendar, User, Tag, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function BriefingDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/briefings">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <PageHeader 
          title={`Briefing ${id}`} 
          description="Visualização detalhada e aprovação do projeto"
          icon={Briefcase}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none bg-secondary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Escopo do Projeto</CardTitle>
              <Badge className="bg-green-500/10 text-green-500 border-none">Aprovado</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-muted-foreground uppercase">Objetivo</h4>
                <p className="text-lg font-medium">Redesign completo da plataforma de e-commerce com foco em conversão e experiência mobile.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase">Público-alvo</h4>
                  <p className="text-sm">Jovens de 18-35 anos, interessados em moda sustentável e tecnologia.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase">Diferenciais</h4>
                  <p className="text-sm">Minimalismo, fluidez extrema e checkout em 2 cliques.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/10">
            <CardHeader>
              <CardTitle>Arquivos e Referências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-xl border group hover:border-audazz-blue transition-all cursor-pointer">
                    <FileText className="w-8 h-8 text-audazz-blue" />
                    <div>
                      <p className="text-sm font-bold">Referência_Visual_0{i}.pdf</p>
                      <p className="text-[10px] text-muted-foreground font-bold">PDF • 4.2 MB</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none bg-secondary/10">
            <CardHeader>
              <CardTitle>Metadados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" /> Cliente
                </div>
                <span className="text-sm font-bold">Fashion Nova</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" /> Data
                </div>
                <span className="text-sm font-bold">12 Mai 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="w-4 h-4" /> Prioridade
                </div>
                <Badge variant="destructive" className="rounded-full">Alta</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-audazz-blue text-white overflow-hidden relative">
            <CardContent className="p-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 opacity-20 absolute -right-2 -top-2" />
              <h3 className="text-lg font-black leading-tight">Aprovar este Briefing?</h3>
              <p className="text-xs opacity-80 font-medium leading-relaxed">Ao aprovar, o projeto será movido automaticamente para a fila de produção no Kanban.</p>
              <Button className="w-full bg-white text-audazz-blue hover:bg-white/90 rounded-full font-bold">APROVAR AGORA</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
