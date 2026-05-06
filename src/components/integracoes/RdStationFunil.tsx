"use client"

import { ArrowRight, RefreshCw, Layers } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function RdStationFunil() {
  const etapasSistema = [
    { label: "Lead", value: "lead" },
    { label: "Prospecto", value: "prospecto" },
    { label: "Proposta Enviada", value: "proposta" },
    { label: "Cliente Ativo", value: "ativo" },
    { label: "Perdido", value: "perdido" },
  ]

  const etapasRd = [
    { label: "Lead", value: "rd_lead" },
    { label: "Qualificado", value: "rd_qualified" },
    { label: "Oportunidade", value: "rd_opportunity" },
    { label: "Venda Concluída", value: "rd_won" },
    { label: "Perdido", value: "rd_lost" },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Mapeamento de Estágios</h3>
            <p className="text-sm text-muted-foreground">Vincule os estágios do seu funil Nexus OS aos estágios do RD Station CRM.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-white/5 bg-background/50 h-11 gap-2">
            <RefreshCw className="w-4 h-4" />
            Atualizar Etapas do RD
          </Button>
        </div>

        <div className="space-y-4">
          {etapasSistema.map((etapa, i) => (
            <div key={etapa.value} className="flex items-center gap-6 p-4 rounded-2xl bg-background/20 border border-white/5 group hover:border-orange-500/30 transition-all">
              <div className="flex-1 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-secondary/50 border border-white/5 flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </div>
                <span className="font-bold">{etapa.label}</span>
              </div>
              
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />

              <div className="flex-1">
                <Select defaultValue={etapasRd[i].value}>
                  <SelectTrigger className="bg-background/50 border-white/5 rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-white/5">
                    {etapasRd.map(rd => (
                      <SelectItem key={rd.value} value={rd.value}>{rd.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button className="bg-orange-500 hover:bg-orange-600 h-12 px-12 rounded-xl font-bold shadow-lg shadow-orange-500/20">
            Salvar Mapeamento
          </Button>
        </div>
      </div>
    </div>
  )
}
