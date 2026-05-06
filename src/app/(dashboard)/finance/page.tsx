"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { DollarSign, ArrowUpCircle, ArrowDownCircle, PieChart as PieChartIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { motion } from "framer-motion"

const data = [
  { name: 'Jan', receita: 4000, despesa: 2400 },
  { name: 'Fev', receita: 3000, despesa: 1398 },
  { name: 'Mar', receita: 2000, despesa: 9800 },
  { name: 'Abr', receita: 2780, despesa: 3908 },
  { name: 'Mai', receita: 1890, despesa: 4800 },
  { name: 'Jun', receita: 2390, despesa: 3800 },
  { name: 'Jul', receita: 3490, despesa: 4300 },
]

const COLORS = ['#0071E3', '#34C759', '#FF9500', '#AF52DE']

export default function FinancePage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Fluxo de Caixa" 
        description="Gestão financeira e indicadores de saúde"
        icon={DollarSign}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Saldo Total", value: "R$ 124.500", icon: DollarSign, color: "text-audazz-blue", trend: "+8.2%" },
          { title: "Entradas (Mês)", value: "R$ 45.200", icon: ArrowUpCircle, color: "text-green-500", trend: "+12%" },
          { title: "Saídas (Mês)", value: "R$ 12.800", icon: ArrowDownCircle, color: "text-red-500", trend: "-2%" },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none bg-secondary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl bg-background border ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-black ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <h3 className="text-2xl font-black tracking-tighter">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Evolução Financeira</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071E3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0071E3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E7" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#86868B' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#86868B' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#0071E3" 
                  fillOpacity={1} 
                  fill="url(#colorReceita)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(0, 4)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="receita" radius={[6, 6, 0, 0]}>
                  {data.slice(0, 4).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
