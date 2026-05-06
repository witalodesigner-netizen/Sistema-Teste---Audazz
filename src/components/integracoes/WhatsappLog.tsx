"use client"

import { CheckCircle2, Clock, XCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function WhatsappLog() {
  const logs = [
    { id: "1", tel: "5511999999999", content: "Sua fatura de R$ 2.500,00 vence em 3 dias...", status: "lida", data: "Hoje, 14:20" },
    { id: "2", tel: "5511888888888", content: "Nova aprovação disponível para John Doe Design", status: "entregue", data: "Hoje, 10:15" },
    { id: "3", tel: "5511777777777", content: "Pagamento confirmado! Obrigado.", status: "enviada", data: "Ontem, 16:45" },
    { id: "4", tel: "5511666666666", content: "Lembrete: Material aguardando aprovação.", status: "falhou", data: "Ontem, 09:30" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "lida": return <CheckCircle2 className="w-4 h-4 text-audazz-blue" />
      case "entregue": return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "falhou": return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold">Histórico de Envios</h3>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por número ou conteúdo..." className="bg-secondary/30 border-white/5 rounded-xl pl-10 h-10" />
        </div>
      </div>

      <div className="bg-secondary/30 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-xl">
        <table className="w-full">
          <thead className="bg-background/50 border-b border-white/5">
            <tr className="text-left">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Destinatário</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Conteúdo</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Enviada Em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-background/20 transition-colors">
                <td className="px-6 py-4 font-medium text-sm">+{log.tel}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{log.content}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span className="text-[10px] font-bold uppercase">{log.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{log.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
