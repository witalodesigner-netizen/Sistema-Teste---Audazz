"use client"

import { useState } from "react"
import { CreditCard, FileText, QrCode, RefreshCw, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createAsaasPayment } from "@/lib/actions/asaas"

interface AsaasCobrancaProps {
  invoice: {
    id: string
    valor: number
    status: string
    asaasPaymentId?: string | null
    asaasInvoiceUrl?: string | null
    asaasBankSlipUrl?: string | null
    asaasStatus?: string | null
  }
}

export function AsaasCobranca({ invoice }: AsaasCobrancaProps) {
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    setLoading(true)
    try {
      await createAsaasPayment(invoice.id)
      toast.success("Cobrança gerada no Asaas!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED":
      case "CONFIRMED": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "OVERDUE": return "bg-red-500/10 text-red-500 border-red-500/20"
      default: return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    }
  }

  return (
    <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-audazz-blue/10 border border-audazz-blue/20 text-audazz-blue">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Gestão Financeira (Asaas)</h3>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">Status: {invoice.asaasStatus || "Não Iniciado"}</p>
          </div>
        </div>
        
        {invoice.asaasStatus && (
          <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${getStatusColor(invoice.asaasStatus)}`}>
            {invoice.asaasStatus}
          </span>
        )}
      </div>

      {!invoice.asaasPaymentId ? (
        <div className="flex flex-col items-center py-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground max-w-xs">Esta fatura ainda não possui uma cobrança vinculada no Asaas.</p>
          <Button 
            onClick={handleCreate} 
            disabled={loading}
            className="bg-audazz-blue hover:bg-audazz-blue/90 rounded-xl px-12 h-12 gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Gerar Cobrança Agora
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href={invoice.asaasInvoiceUrl || "#"} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-white/5 bg-background/50 hover:bg-background/80 gap-3 justify-start px-6">
              <div className="p-2 rounded-lg bg-audazz-blue/10 text-audazz-blue">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-audazz-blue uppercase">Fatura Digital</p>
                <p className="text-[10px] text-muted-foreground">Visualizar/Pagar online</p>
              </div>
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </Button>
          </a>

          <a href={invoice.asaasBankSlipUrl || "#"} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-white/5 bg-background/50 hover:bg-background/80 gap-3 justify-start px-6">
              <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase">Boleto / PIX</p>
                <p className="text-[10px] text-muted-foreground">Download PDF / QR Code</p>
              </div>
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </Button>
          </a>
        </div>
      )}
    </div>
  )
}

function Zap(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.75V3.5h16v11.25m-16 0L20 20m-16-5.25L20 9.5"/></svg>
  )
}
