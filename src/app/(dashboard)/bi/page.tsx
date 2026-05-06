"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { motion } from "framer-motion"

const data = [
  { name: 'Sem 1', vpc: 400, roi: 2.4, leads: 240 },
  { name: 'Sem 2', vpc: 300, roi: 4.5, leads: 139 },
  { name: 'Sem 3', vpc: 200, roi: 3.2, leads: 980 },
  { name: 'Sem 4', vpc: 278, roi: 5.1, leads: 390 },
]

export default function BIPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Relatórios BI" 
        description="Análise inteligente de dados e performance"
        icon={BarChart3}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full gap-2">
              <Calendar className="w-4 h-4" /> Maio 2026
            </Button>
            <Button className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-full gap-2">
              <Download className="w-4 h-4" /> Exportar PDF
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-audazz-blue" /> Conversão de Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#0071E3" strokeWidth={3} dot={{ r: 4, fill: '#0071E3' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold">ROI Médio Mensal</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none' }}
                />
                <Bar dataKey="roi" fill="#34C759" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "CPA Médio", value: "R$ 42,50", trend: "-15%", color: "text-green-500" },
          { label: "Taxa de Conversão", value: "12.4%", trend: "+2.1%", color: "text-audazz-blue" },
          { label: "Ticket Médio", value: "R$ 4.200", trend: "+8.4%", color: "text-purple-500" },
        ].map((metric, i) => (
          <Card key={metric.label} className="border-none bg-secondary/5 border-2 border-dashed border-secondary">
            <CardContent className="p-6 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{metric.label}</p>
              <h4 className="text-3xl font-black">{metric.value}</h4>
              <p className={`text-xs font-bold ${metric.color} mt-1`}>{metric.trend} vs mês ant.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
