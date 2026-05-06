"use client"

import { AuditoriaTable } from "@/components/seguranca/AuditoriaTable"
import { ChevronLeft, Download, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuditoriaPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/configuracoes/seguranca" className="text-sm text-muted-foreground hover:text-audazz-blue flex items-center gap-1 mb-2 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Voltar para Segurança
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Logs de Auditoria</h1>
          <p className="text-muted-foreground">Histórico completo e imutável de todas as ações realizadas no sistema.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-white/5 bg-secondary/30 backdrop-blur-xl gap-2">
            <Filter className="w-4 h-4" />
            Filtrar Avançado
          </Button>
          <Button variant="outline" className="rounded-xl border-white/5 bg-secondary/30 backdrop-blur-xl gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="bg-secondary/30 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-xl">
        <AuditoriaTable />
      </div>
    </div>
  )
}
