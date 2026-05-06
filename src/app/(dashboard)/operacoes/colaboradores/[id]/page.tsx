"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { ArrowLeft, User, Wallet, Zap, BarChart3, Mail, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { usePathname, useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CollaboratorDetailPage() {
  const params = useParams()
  const id = params.id as string
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/operacoes/colaboradores">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="h-6 w-[1px] bg-white/10" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Perfil do Colaborador</p>
      </div>

      {/* Header do Perfil */}
      <div className="bg-secondary/10 backdrop-blur-sm rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-audazz-blue/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <Avatar className="w-40 h-40 border-8 border-background shadow-2xl ring-4 ring-audazz-blue/10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-audazz-blue text-white text-5xl font-black">LO</AvatarFallback>
          </Avatar>

          <div className="space-y-6 text-center md:text-left flex-1">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-black tracking-tight">Lucas Oliveira</h1>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 rounded-full px-4 py-1">Ativo</Badge>
              </div>
              <p className="text-xl font-bold text-muted-foreground">Senior UI Designer • Design Team</p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              <div className="flex items-center gap-2 text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <Mail className="w-4 h-4 text-audazz-blue" />
                lucas@audazz.com
              </div>
              <div className="flex items-center gap-2 text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <Calendar className="w-4 h-4 text-audazz-blue" />
                Admitido em Out 2023
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
             <Button className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full font-bold gap-2 h-12 shadow-lg shadow-audazz-blue/20">
                <Zap className="w-4 h-4" /> Alocar Projeto
             </Button>
             <Button variant="outline" className="rounded-full border-white/10 h-12 font-bold">
                Editar Dados
             </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo em Abas */}
      <Tabs defaultValue="dados" className="w-full flex flex-col gap-8">
        <TabsList className="bg-secondary/20 p-1 rounded-full border border-white/5 h-12 w-fit">
          <TabsTrigger value="dados" className="rounded-full px-8 h-full font-bold data-[state=active]:bg-audazz-blue data-[state=active]:text-white transition-all">
            <User className="w-4 h-4 mr-2" /> Dados
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="rounded-full px-8 h-full font-bold data-[state=active]:bg-audazz-blue data-[state=active]:text-white transition-all">
            <Wallet className="w-4 h-4 mr-2" /> Financeiro
          </TabsTrigger>
          <TabsTrigger value="alocacao" className="rounded-full px-8 h-full font-bold data-[state=active]:bg-audazz-blue data-[state=active]:text-white transition-all">
            <Zap className="w-4 h-4 mr-2" /> Alocação
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-full px-8 h-full font-bold data-[state=active]:bg-audazz-blue data-[state=active]:text-white transition-all">
            <BarChart3 className="w-4 h-4 mr-2" /> Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <InfoCard title="Dados Pessoais">
                <div className="space-y-4">
                   <InfoItem label="CPF" value="***.***.***-**" />
                   <InfoItem label="Data de Nasc." value="15/08/1992" />
                   <InfoItem label="Gênero" value="Masculino" />
                   <InfoItem label="Telefone" value="(11) 99999-9999" />
                </div>
             </InfoCard>
             <InfoCard title="Endereço">
                <div className="space-y-4">
                   <InfoItem label="Cidade" value="São Paulo" />
                   <InfoItem label="Estado" value="SP" />
                   <InfoItem label="Bairro" value="Vila Madalena" />
                   <InfoItem label="CEP" value="05445-000" />
                </div>
             </InfoCard>
          </div>
        </TabsContent>

        <TabsContent value="financeiro">
           <div className="bg-secondary/5 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-white/5">
              <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold">Dados Financeiros Privados</h3>
              <p className="text-sm text-muted-foreground mt-2">Somente administradores e o financeiro possuem acesso a estas informações.</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InfoCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-secondary/10 p-8 rounded-[2.5rem] border border-white/5">
      <h4 className="text-lg font-bold mb-6 text-audazz-blue">{title}</h4>
      {children}
    </div>
  )
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 gap-4">
      <span className="text-sm text-muted-foreground font-medium shrink-0">{label}</span>
      <span className="text-sm font-bold text-right break-words">{value}</span>
    </div>
  )
}
