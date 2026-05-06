"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { Users, ArrowLeft, Mail, Phone, Globe, Building2, TrendingUp, History, DollarSign, Layout, ShieldCheck, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"

// Novos Componentes Integrados
import { MembrosTab } from "@/components/clientes/membros/MembrosTab"
import { PortalConfig } from "@/components/clientes/membros/PortalConfig"

export default function ClientDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/clients">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <PageHeader 
          title="TechFlow Solutions" 
          description={`ID do Cliente: ${id} • Desde Jan 2024`}
          icon={Users}
        />
      </div>

      <Tabs defaultValue="geral" className="w-full flex flex-col gap-8">
        <TabsList className="bg-secondary/20 p-1 rounded-full border border-white/5 h-12 w-fit">
          <TabsTrigger value="geral" className="rounded-full px-8 h-full font-bold data-[state=active]:bg-audazz-blue data-[state=active]:text-white transition-all">
            <Layout className="w-4 h-4 mr-2" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="membros" className="rounded-full px-8 h-full font-bold data-[state=active]:bg-audazz-blue data-[state=active]:text-white transition-all">
            <ShieldCheck className="w-4 h-4 mr-2" /> Área de Membros
          </TabsTrigger>
          <TabsTrigger value="config" className="rounded-full px-8 h-full font-bold data-[state=active]:bg-audazz-blue data-[state=active]:text-white transition-all">
            <Settings className="w-4 h-4 mr-2" /> Portal do Cliente
          </TabsTrigger>
        </TabsList>

        {/* ABA: VISÃO GERAL */}
        <TabsContent value="geral">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-none bg-secondary/10 overflow-hidden rounded-[2.5rem]">
                <div className="h-24 bg-audazz-blue" />
                <CardContent className="p-6 -mt-12 text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-background shadow-lg">
                    <AvatarFallback className="bg-audazz-blue text-white text-3xl font-black">TF</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">TechFlow</h3>
                    <Badge className="bg-green-500/10 text-green-500 border-none rounded-full">Cliente VIP</Badge>
                  </div>
                  <div className="flex flex-col gap-3 pt-4">
                    <Button variant="outline" className="rounded-full gap-2 w-full border-white/10">
                      <Mail className="w-4 h-4" /> Enviar E-mail
                    </Button>
                    <Button variant="outline" className="rounded-full gap-2 w-full border-white/10">
                      <Phone className="w-4 h-4" /> Chamar WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-secondary/10 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Contato Principal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Ricardo Santos</p>
                    <p className="text-xs text-muted-foreground">Diretor de Marketing</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Localização</p>
                    <p className="text-xs font-medium flex items-center gap-2">
                      <Globe className="w-3 h-3 text-audazz-blue" /> São Paulo, SP
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "LTV (Total)", value: "R$ 420k", icon: DollarSign, color: "text-green-500" },
                  { label: "Projetos Ativos", value: "04", icon: Building2, color: "text-audazz-blue" },
                  { label: "Health Score", value: "9.8/10", icon: TrendingUp, color: "text-purple-500" },
                ].map((stat, i) => (
                  <Card key={i} className="border-none bg-secondary/10 rounded-[2rem]">
                    <CardContent className="p-6 space-y-2">
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-none bg-secondary/10 rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-audazz-blue" /> Histórico de Interações
                  </CardTitle>
                  <CardDescription>Últimos contatos e decisões tomadas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { date: "02 Mai", event: "Reunião de Kick-off (Redesign)", type: "Call" },
                    { date: "28 Abr", event: "Aprovação de Orçamento Q2", type: "Email" },
                    { date: "15 Abr", event: "Entrega: Social Media Março", type: "Sistema" },
                  ].map((ev, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-audazz-blue shadow-[0_0_10px_rgba(0,113,227,0.5)]" />
                        {i !== 2 && <div className="w-0.5 h-full bg-border mt-1" />}
                      </div>
                      <div className="pb-8">
                        <p className="text-[10px] font-black text-muted-foreground uppercase">{ev.date} • {ev.type}</p>
                        <p className="text-sm font-bold">{ev.event}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ABA: ÁREA DE MEMBROS */}
        <TabsContent value="membros" className="mt-0">
          <MembrosTab clientId={id as string} />
        </TabsContent>

        {/* ABA: CONFIGURAÇÃO DO PORTAL */}
        <TabsContent value="config" className="mt-0">
          <PortalConfig clientId={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
