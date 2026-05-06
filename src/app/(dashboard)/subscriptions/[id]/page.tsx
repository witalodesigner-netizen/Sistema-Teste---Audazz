"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { RefreshCw, ArrowLeft, CreditCard, Calendar, AlertCircle, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function SubscriptionDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/subscriptions">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <PageHeader 
          title="Nike Corp - Retainer" 
          description={`Assinatura ID: ${id} • Plano Premium`}
          icon={RefreshCw}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none bg-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-audazz-blue" /> Detalhes do Plano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valor Mensal</p>
                  <p className="text-3xl font-black text-audazz-blue">R$ 12.000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Próximo Vencimento</p>
                  <p className="text-3xl font-black">15 Mai</p>
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <h4 className="text-sm font-bold border-b pb-2">Itens Inclusos</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {["8x Criativos Estáticos", "4x Motion Graphics", "Gestão de Tráfego", "Dashboard Real-time"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-audazz-blue" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/10">
            <CardHeader>
              <CardTitle>Histórico de Faturas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { month: "Abril 2026", status: "Pago", date: "15/04" },
                  { month: "Março 2026", status: "Pago", date: "15/03" },
                  { month: "Fevereiro 2026", status: "Pago", date: "15/02" },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-background rounded-2xl border group hover:border-audazz-blue transition-all">
                    <div className="flex items-center gap-4">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-bold">{inv.month}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">Vencimento: {inv.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-green-500/10 text-green-500 border-none">{inv.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none bg-red-500/5 border border-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Zona de Perigo
              </CardTitle>
              <CardDescription>Ações que podem afetar o faturamento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full rounded-full border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors">Pausar Recorrência</Button>
              <Button variant="outline" className="w-full rounded-full border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors">Cancelar Assinatura</Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/10">
            <CardHeader>
              <CardTitle className="text-sm">Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-background rounded-2xl border">
                <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center font-bold text-[8px] text-slate-500 uppercase tracking-tighter">VISA</div>
                <div>
                  <p className="text-sm font-bold">**** 4242</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Exp: 12/28</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-xs font-bold text-audazz-blue">Alterar Cartão</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
