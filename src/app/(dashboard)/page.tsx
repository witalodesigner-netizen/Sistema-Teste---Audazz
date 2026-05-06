import { 
  Briefcase, 
  Users, 
  DollarSign, 
  BarChart3, 
  ArrowUpRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getBrandingConfig } from "@/lib/actions/branding"

export default async function Dashboard() {
  const branding = await getBrandingConfig();
  const systemName = branding.data?.systemName || "Audazz";

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            {systemName} Dashboard <span className="text-audazz-blue">.</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Bem-vindo ao {systemName}. Aqui está o resumo da sua operação hoje.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/settings/security">
            <Button variant="outline" className="rounded-xl border-white/5 bg-secondary/30 backdrop-blur-xl gap-2 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-audazz-blue" />
              Segurança OK
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Projetos Ativos", value: "12", icon: Briefcase, color: "text-audazz-blue" },
          { title: "Leads Novos", value: "48", icon: Users, color: "text-green-500" },
          { title: "Receita (Asaas)", value: "R$ 45k", icon: DollarSign, color: "text-emerald-500" },
          { title: "ROI Médio", value: "4.2x", icon: BarChart3, color: "text-purple-500" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-background border ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                  +12% <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automação & Segurança Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none bg-secondary/10 hover:bg-secondary/20 transition-all cursor-pointer group">
          <Link href="/settings/integrations/rdstation">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-background border text-orange-500">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase">Ativo</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Sync RD Station</p>
                <p className="text-xl font-bold">4 Leads Sincronizados</p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-none bg-secondary/10 hover:bg-secondary/20 transition-all cursor-pointer group">
          <Link href="/settings/integrations/whatsapp">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-background border text-green-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold uppercase">Online</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Automação WhatsApp</p>
                <p className="text-xl font-bold">12 Notificações Enviadas</p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-none bg-secondary/10 hover:bg-secondary/20 transition-all cursor-pointer group">
          <Link href="/settings/security/auditoria">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-background border text-audazz-blue">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground italic">Monitorando</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Logs de Auditoria</p>
                <p className="text-xl font-bold">Integridade Verificada</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Middle Section: Kanban Preview & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 border-none bg-secondary/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Próximos Deliverables</CardTitle>
              <CardDescription>Prazos e status das tarefas prioritárias</CardDescription>
            </div>
            <SidebarTrigger className="lg:hidden" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Redesign Landing Page", client: "TechFlow", deadline: "Hoje", status: "Em Revisão", color: "bg-orange-500" },
                { task: "Campanha Meta Ads Q2", client: "LuxGlow", deadline: "Amanhã", status: "Execução", color: "bg-audazz-blue" },
                { task: "Motion Graphics Intro", client: "VibeStudio", deadline: "12 Mai", status: "Aguardando", color: "bg-muted-foreground" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50 hover:border-audazz-blue/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-10 rounded-full ${item.color}`} />
                    <div>
                      <p className="font-bold text-sm group-hover:text-audazz-blue transition-colors">{item.task}</p>
                      <p className="text-xs text-muted-foreground font-medium">{item.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{item.deadline}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-secondary/10">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { user: "Witalo", action: "aprovou o briefing de", target: "Nike Corp", time: "10m atrás", icon: CheckCircle2, color: "text-green-500" },
                { user: "Sistema", action: "confirmou pagamento via Pix de", target: "Apple Inc", time: "2h atrás", icon: DollarSign, color: "text-emerald-500" },
                { user: "Cliente", action: "solicitou alteração em", target: "Post Social", time: "5h atrás", icon: AlertCircle, color: "text-orange-500" },
              ].map((activity, i) => (
                <div key={activity.user + i} className="flex gap-4">
                  <div className={`shrink-0 w-8 h-8 rounded-full bg-background border flex items-center justify-center ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

