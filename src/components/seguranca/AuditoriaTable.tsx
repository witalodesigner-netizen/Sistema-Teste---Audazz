"use client"

import { Shield, User, Globe, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

export function AuditoriaTable() {
  const logs = [
    { 
      id: "1", 
      user: "Witalo Sales", 
      email: "witalo@audazz.com", 
      acao: "Acesso ao Painel Financeiro", 
      recurso: "Financeiro", 
      ip: "191.185.12.102",
      risco: "baixo",
      sucesso: true,
      data: "06/05/2026 14:20"
    },
    { 
      id: "2", 
      user: "Sistema (Webhook)", 
      email: "asaas@api.com", 
      acao: "Pagamento Recebido (Pix)", 
      recurso: "Fatura #8542", 
      ip: "15.228.14.55",
      risco: "baixo",
      sucesso: true,
      data: "06/05/2026 13:45"
    },
    { 
      id: "3", 
      user: "Admin", 
      email: "admin@audazz.com", 
      acao: "Alteração de Permissões", 
      recurso: "RBAC / Roles", 
      ip: "191.185.12.102",
      risco: "alto",
      sucesso: true,
      data: "06/05/2026 11:15"
    },
    { 
      id: "4", 
      user: "Desconhecido", 
      email: "unknown@evil.com", 
      acao: "Tentativa de Login Falha", 
      recurso: "Auth / Login", 
      ip: "45.12.222.10",
      risco: "critico",
      sucesso: false,
      data: "06/05/2026 09:30"
    }
  ]

  const getRiscoBadge = (risco: string) => {
    const base = "text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border"
    switch (risco) {
      case "critico": return `${base} bg-red-500/20 text-red-500 border-red-500/30`
      case "alto": return `${base} bg-orange-500/20 text-orange-500 border-orange-500/30`
      case "medio": return `${base} bg-yellow-500/20 text-yellow-500 border-yellow-500/30`
      default: return `${base} bg-green-500/20 text-green-500 border-green-500/30`
    }
  }

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="bg-background/50 border-b border-white/5">
          <tr className="text-left">
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Usuário / IP</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ação / Recurso</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">Risco</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">Data / Hora</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-background/20 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{log.user}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {log.ip}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-bold">{log.acao}</p>
                <p className="text-xs text-muted-foreground italic">{log.recurso}</p>
              </td>
              <td className="px-6 py-4 text-center">
                {log.sucesso ? (
                  <div className="flex justify-center"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                ) : (
                  <div className="flex justify-center"><XCircle className="w-5 h-5 text-red-500" /></div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  <span className={getRiscoBadge(log.risco)}>{log.risco}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right text-xs text-muted-foreground font-mono">
                {log.data}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
